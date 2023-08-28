const { connect } = require('getstream');
const bcryptjs = require('bcryptjs');

 const StreamChat = require('stream-chat').StreamChat;
const crypto = require('crypto');

require('dotenv').config();

const api_key = process.env.STREAM_API_KEY;
const api_secret = process.env.STREAM_API_SECRET;
const app_id = process.env.STREAM_APP_ID;
//console.log("jg2j");
const signup = async (req, res) => {
    try {
        
        const { fullName, username, password, phoneNumber,  employer_id } = req.body;

        const userId = crypto.randomBytes(16).toString('hex');

        const serverClient = connect(api_key, api_secret, app_id);

        const hashedPassword = await bcryptjs.hash(password, 10);
            const employer_id1 = employer_id;
        const token = serverClient.createUserToken(userId);
                const client = StreamChat.getInstance(api_key , api_secret);
              
                try {
                    const  response  = await client.queryUsers({
                        $and: [
                                    { name: { $eq: employer_id} },
                                  { relation :  { $eq: "Employer" } },
                                ],
                     });
                     console.log(response);
                     if(employer_id !== ""  && !response.users.length) return res.status(400).json({ message: 'not an valid employer id' });
                     const fulllName = fullName;
                             res.status(200).json({ token, fulllName, username, userId, hashedPassword, phoneNumber, employer_id1 });
                   }
       
  
                 catch (error) {
                    res.status(500).json({ message: {error} });
                }

    } catch (error) {
  

        res.status(500).json({ message: "" });
 }

};

const login = async (req, res) => {
    try {
        const { username, password } = req.body;
        
        const serverClient = connect(api_key, api_secret, app_id);
        const client = StreamChat.getInstance(api_key, api_secret);

        const { users } = await client.queryUsers({ name: username });

        if(!users.length) return res.status(400).json({ message: 'User not found' });

        const success = await bcryptjs.compare(password, users[0].hashedPassword);

        const token = serverClient.createUserToken(users[0].id);

        if(success) {
            res.status(200).json({ token, fulllName: users[0].fullName, username, userId: users[0].id , employer_id1 : users[0].erid });
        } else {
            res.status(500).json({ message: 'Incorrect password' });
        }
    } catch (error) {
        console.log(error);

        res.status(500).json({ message: "" });
    }
};

module.exports = { signup, login }
