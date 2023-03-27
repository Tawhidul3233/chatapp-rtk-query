import gravatarUrl from "gravatar-url";
import moment from "moment/moment";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useGetConversationsQuery } from "../../features/conversations/conversationsApi";
import getPartnerInfo from "../../utils/getPartnerInfo";
import ChatItem from "./ChatItem";

export default function ChatItems() {
    const { user } = useSelector(state => state.auth) || {};
    const { email } = user || {};
    const { data: conversations, isLoading, isError, error } = useGetConversationsQuery(email)

    // what to render 
    let content = null;

    if (isLoading) {
        content = <li> Loading... </li>
    }
    else if (!isLoading && isError) {
        content = <li> {error.data} </li>
    }
    else if (!isLoading && !isError && conversations?.length === 0) { content = <li> No conversations found! </li> }

    else if (!isLoading && !isError && conversations?.length > 0) {
        content = conversations.map((conversation) => {
            const { message, id, timestamp } = conversation;

            const { email: participantEmail, name: participantName } = getPartnerInfo(conversation.users, email);

            // console.log(participantEmail)

            return (
                <li key={id}>
                    <Link to={`/inbox/${id}`}>
                        <ChatItem
                            avatar={gravatarUrl(participantEmail, { size: 80 })}
                            name={participantName}
                            lastMessage={message}
                            lastTime={moment(timestamp).fromNow()}
                        />
                    </Link>
                </li>
            )
        })
    }


    //  } else if (!isLoading && !isError && conversations?.length > 0) {
    //      content = conversations.map((conversation) => {
    //          const { id, message, timestamp } = conversation;
    //          const { email } = user || {};
    //          const { name, email: partnerEmail } = getPartnerInfo(
    //              conversation.users,
    //              email
    //          );

    //          return (
    //              <li key={id}>
    //                  <Link to={`/inbox/${id}`}>
    //                      <ChatItem
    //                          avatar={gravatarUrl(partnerEmail, {
    //                              size: 80,
    //                          })}
    //                          name={name}
    //                          lastMessage={message}
    //                          lastTime={moment(timestamp).fromNow()}
    //                      />
    //                  </Link>
    //              </li>
    //          );
    //      });
    //  }


    return (
        <ul>
            {content}
        </ul>
    );
}
