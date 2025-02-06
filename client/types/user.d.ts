interface UserType {
  clerkId: string;
  fullName: string;
  userName: string;
  email: string;
  profileImageUrl: string;
}

interface ChatType {
  senderId: string;
  senderName: string;
  message: string;
  createdAt?: string;
}

export { UserType, ChatType };
