import axiosInstance from "@/core/api/axiosInstance";
import { AxiosResponse } from "axios";
import Link from "next/link";
import { useEffect, useState } from "react";

interface UserBase {
  id: number;
  teamId: string;
  email: string;
  nickname: string;
  image: string | null;
  createdAt: string;
  updatedAt: string;
}

interface Membership {
  group: {
    id: number;
    teamId: string;
    name: string;
    image: string;
    createdAt: string;
    updatedAt: string;
  };
  userId: number;
  groupId: number;
  role: "ADMIN" | "MEMBER";
  userName: string;
  userImage: string;
  userEmail: string;
}

interface UserResponse extends UserBase {
  memberships: Membership[];
}

const INITIAL_USER_INFO: UserResponse = {
  id: 0,
  teamId: "",
  email: "",
  nickname: "",
  image: null,
  createdAt: "",
  updatedAt: "",
  memberships: [],
};

export default function Home() {
  const [userInfo, setUserInfo] = useState(INITIAL_USER_INFO);

  const getUserInfo = async () => {
    try {
      const response = await axiosInstance.get("/user");
      if (response && response.data) {
        // 데이터가 정상적으로 존재하는 경우에만 접근
        const { name, email } = response.data;
        console.log("User Info:", { name, email });
      } else {
        console.error("User data is not available");
      }
    } catch (error) {
      console.error("Error fetching user info:", error);
    }
  };

  useEffect(() => {
    getUserInfo();
  }, []);

  return (
    <div>
      <Link href="/signup">회원가입 페이지</Link>
      <br />
      <Link href="/login">로그인 페이지</Link>
      <br />
      <Link href="/addteam">팀 생성하기 페이지</Link>
      <br />
      <Link href="/mypage">마이페이지</Link>
      <br />
      <Link href="/boards">자유게시판</Link>
      <br />
      <Link href="/addboard">게시물 등록 페이지</Link>
      <br />
      <br />
      <h2 className="text-text-3xl">내가 속한 팀</h2>
      <br />
      {userInfo.memberships.map((membership) => (
        <>
          <Link href={`/${membership.groupId}`} key={membership.groupId}>
            {membership.group.name}
          </Link>
          <br />
        </>
      ))}
    </div>
  );
}
