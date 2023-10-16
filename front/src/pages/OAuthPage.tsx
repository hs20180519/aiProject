/* eslint-disable */
import { useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { OAuthKakaoLoginWithSnsId } from "../apis/social";

export default function OAuthPage() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const [snsId, setSnsId] = useState("");

  const fetchKakaoLogin = async () => {
    try {
      console.log("------login request-------");
      const res = await OAuthKakaoLoginWithSnsId(snsId);
      sessionStorage.setItem("userToken", res.data.token);
      navigate("/main", { replace: true });
    } catch (e) {}
  };

  useEffect(() => {
    const value = searchParams.get("snsId");
    if (value) {
      setSnsId(value);
    }
  }, [location]);

  useEffect(() => {
    if (snsId !== "") {
      fetchKakaoLogin();
    }
  }, [snsId]);

  return <>일로 넘어왓다~~~~~~~~</>;
}
