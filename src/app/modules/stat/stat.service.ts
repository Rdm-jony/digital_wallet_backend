import { Transaction } from "../transaction/transaction.model"
import { User } from "../user/user.model"
import { Wallet } from "../wallet/wallet.model"

const now = new Date();
const sevenDaysAgo = new Date(now).setDate(now.getDate() - 7);
const thirtyDaysAgo = new Date(now).setDate(now.getDate() - 30);

const getTransactionStat = async (userId: string) => {
    const isWalletExist = await Wallet.findOne({ user: userId })
    if (!isWalletExist?._id) return []

    const walletId = isWalletExist._id

    const stats = await Transaction.aggregate([
        {
            $match: {
                status: "SUCCESS", // ✅ only successful transactions
                $or: [
                    // TOPUP: wallet as sender OR receiver
                    {
                        transferType: "TOPUP",
                        $or: [{ senderWallet: walletId }, { receiverWallet: walletId }],
                    },
                    // WITHDRAW: wallet as sender OR receiver
                    {
                        transferType: "WITHDRAW",
                        $or: [{ senderWallet: walletId }, { receiverWallet: walletId }],
                    },
                    // OTHERS: only wallet as sender
                    {
                        transferType: { $nin: ["TOPUP", "WITHDRAW"] },
                        senderWallet: walletId,
                    },
                ],
            },
        },
        {
            $group: {
                _id: "$transferType",
                totalAmount: { $sum: "$amount" },
                count: { $sum: 1 },
            },
        },
        {
            $project: {
                _id: 0,
                transferType: "$_id",
                totalAmount: 1,
                count: 1,
            },
        },
    ])

    return stats
}

const getUserStats = async () => {
    const totalUsersPromise = User.countDocuments()
   
    const totalBlockedUsersPromise = User.countDocuments({ isBlocked:true })

    const newUsersInLast7DaysPromise = User.countDocuments({
        createdAt: { $gte: sevenDaysAgo }
    })
    const newUsersInLast30DaysPromise = User.countDocuments({
        createdAt: { $gte: thirtyDaysAgo }
    })

    const usersByRolePromise = User.aggregate([
        //stage -1 : Grouping users by role and count total users in each role

        {
            $group: {
                _id: "$role",
                count: { $sum: 1 }
            }
        }
    ])


    const [totalUsers,totalBlockedUsers, newUsersInLast7Days, newUsersInLast30Days, usersByRole] = await Promise.all([
        totalUsersPromise,
       
        totalBlockedUsersPromise,
        newUsersInLast7DaysPromise,
        newUsersInLast30DaysPromise,
        usersByRolePromise
    ])
    return {
        totalUsers,
        totalBlockedUsers,
        newUsersInLast7Days,
        newUsersInLast30Days,
        usersByRole
    }
}


export const statSevices = {
    getTransactionStat,
    getUserStats
}