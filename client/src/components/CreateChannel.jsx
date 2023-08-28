import React, { useState } from 'react';
import { useChatContext } from 'stream-chat-react';
import Cookies from 'universal-cookie';


import { UserList } from './';
import { CloseCreateChannel } from '../assets';

const cookies = new Cookies();
const ChannelNameInput = ({ channelName = '', setChannelName }) => {
    const handleChange = (event) => {
        event.preventDefault();

        setChannelName(event.target.value);
    }

    return (
        <div className="channel-name-input__wrapper">
            <p>Name</p>
            <input value={channelName} onChange={handleChange} placeholder="channel-name" />
            <p>Add Members</p>
        </div>
    )
}

const CreateChannel = ({ createType, setIsCreating }) => {
    const { client, setActiveChannel } = useChatContext();
    let p =[client.userID];
        if(cookies.get('role') === "Employee"){
            const x = client.queryUsers({
                $and: [
                    { id: { $ne: client.userID } },
                  { name :  { $eq: cookies.get('Er.id') } },
                ],
            }
           
        )
               // console.log(x.users?.id);
                if(x.users)
        p = p.concat(x.users.id);
        }
       

    const [selectedUsers, setSelectedUsers] = useState(p)
    const [channelName, setChannelName] = useState('');

    const createChannel = async (e) => {
        e.preventDefault();

        try {
            const newChannel = await client.channel(createType, channelName, {
                name: channelName, members: selectedUsers
            });

            await newChannel.watch();

            setChannelName('');
            setIsCreating(false);
            setSelectedUsers([client.userID]);
            setActiveChannel(newChannel);
        } catch (error) {
            console.log(error);
        }
    }

    return (
        <div className="create-channel__container">
            <div className="create-channel__header">
                <p>{createType === 'team' ? 'Create a New Channel' : 'Send a Direct Message'}</p>
                <CloseCreateChannel setIsCreating={setIsCreating} />
            </div>
            {createType === 'team' && <ChannelNameInput channelName={channelName} setChannelName={setChannelName}/>}
            <UserList setSelectedUsers={setSelectedUsers} />
            <div className="create-channel__button-wrapper" onClick={createChannel}>
                <p>{createType === 'team' ? 'Create Channel' : 'Create Message Group'}</p>
            </div>
        </div>
    )
}

export default CreateChannel
