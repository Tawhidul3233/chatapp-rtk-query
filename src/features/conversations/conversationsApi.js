import { apiSlice } from "../api/apiSlice";
import { messagesApi } from "../messages/messagesApi";

export const conversationsApi = apiSlice.injectEndpoints({
  endpoints: (builder) => ({
    getConversations: builder.query({
      query: (email) => `/conversations?participants_like=${email}&_sort=timestamp&_order=desc&_page=1&_limit=5`
    }),
    getConversation: builder.query({
      query: ({ userEmail, particpantEmail }) => `/conversations?participants_like=${userEmail}-${particpantEmail}&&participants_like=${particpantEmail}-${userEmail}`
    }),
    addConversation: builder.mutation({
      query: ({ senderEmail, data }) => ({
        url: '/conversations',
        method: 'POST',
        body: data
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {
        const conversation = await queryFulfilled;
        // console.log(arg)
        const users = arg?.data.users;
        const senderUser = users.find(user => user.email === arg?.senderEmail);
        const receiverUser = users.find(user => user.email !== arg?.senderEmail)

        if (conversation?.data?.id) {
          dispatch(messagesApi.endpoints.addeMssage.initiate({
            conversationId: conversation?.data?.id,
            sender: senderUser,
            receiver: receiverUser,
            message: arg?.data?.message,
            timestamp: arg?.data?.timestamp
          }))
        }
      }
    }),
    editConversation: builder.mutation({
      query: ({ senderEmail, id, data }) => ({
        url: `/conversations/${id}`,
        method: 'PATCH',
        body: data
      }),
      async onQueryStarted(arg, { queryFulfilled, dispatch }) {

        // clinte site optimistic cash update
        const patchResult = dispatch(apiSlice.util.updateQueryData('getConversations', arg.senderEmail, (draft) => {
          const draftConversation = draft.find(c => c.id == arg.id);
          draftConversation.message = arg.data.message;
          draftConversation.timestamp = arg.data.timestamp;
        }))
        // optimistic cash update end

        try {
          const conversation = await queryFulfilled;
          // console.log(arg)
          if (conversation?.data?.id) {

            const users = arg?.data.users;
            const senderUser = users.find(user => user.email === arg?.senderEmail);
            const receiverUser = users.find(user => user.email !== arg?.senderEmail)

            const res = await dispatch(messagesApi.endpoints.addeMssage.initiate({
              conversationId: conversation?.data?.id,
              sender: senderUser,
              receiver: receiverUser,
              message: arg?.data?.message,
              timestamp: arg?.data?.timestamp
            })).unwrap();

            // pessimistic cash update 
            dispatch(apiSlice.util.updateQueryData('getMessages', res.conversationId.toString(), (draft) => {
              draft.push(res)
            }))
            // pessimistic update end

          }
        } catch (error) {
          patchResult.undo()
        }

      }
    }),

  })
})

export const { useGetConversationsQuery, useGetConversationQuery, useAddConversationMutation, useEditConversationMutation } = conversationsApi;