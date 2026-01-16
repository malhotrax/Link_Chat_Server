import { userRespository } from "../repository/userRespository.mjs";

export class UserService {
    static async createUser(
        username,
        password,
        email,
        fullName,
        dateOfBirth
    ){
        const user = await userRespository.create({
            username,
            password,
            email,
            fullName,
            dateOfBirth
        });
        return user;
    }

    static async getUserById(userId){
        return await userRespository.findById(userId);
    }

    static async userExistsWithGivenEmail(email){
        const user = await userRespository.findByEmail(email);
        return user !== null;
    }

    static async userExistsWithGivenUsername(username){
        const user = await userRespository.findByUsername(username);
        return user !== null;
    }

    static async loginUser(
        email,
        password
    ){
        
    }
    static async deleteAccount(userId){
        await userRespository.deleteById(userId);
    }
    static async updateUsername(userId, newUsername){
        await userRespository.updateUsernameById(userId, newUsername);
    }
    static async updatePassword(userId, newPassword){
        await userRespository.updatePasswordById(userId, newPassword);
    }
    static async sendFriendRequest(userId, friendId){
        await userRespository.addFriendRequest(userId, friendId);
    }
    static async acceptFriendRequest(fromUserId, toUserId){
        await userRespository.acceptFriendRequest(fromUserId, toUserId);
    }
    static async blockUser(userId, blockedUserId){
        await userRespository.blockUserById(userId, blockedUserId);
    } 
    static async unfriendUser(userId, friendId){
        await userRespository.deleleFromFriendsById(userId, friendId);  
    }
    static async rejectFriendRequest(fromUserId, toUserId){
        await userRespository.rejectFriendRequest(fromUserId, toUserId);
    }
}