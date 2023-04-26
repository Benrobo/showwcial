import React, { useEffect, useState } from "react";
import { MdOutlineKeyboardBackspace } from "react-icons/md";
import { useMutation } from "react-query";
import { toast } from "react-toastify";
import { resendVerificationCode, verifyUserEmail } from "../../http";
import { Spinner } from "../../components/Loader";
import { useRouter } from "next/router";
import { sleep } from "../../util";
import Link from "next/link";

function VerifyMail() {
  const router = useRouter()
  const [inpVal, setInpVal] = useState({
    pad1: "",
    pad2: "",
    pad3: "",
    pad4: "",
    pad5: "",
    pad6: "",
  });
  const {pad1,pad2,pad3,pad4,pad5,pad6} = inpVal;
  const verifyCode = "".concat(pad1, pad2,pad3,pad4,pad5,pad6);
  const verifyMutation = useMutation(async (code)=>{
    return await verifyUserEmail(code as any);
  })
  const resendCodeMutation = useMutation(async (email)=>{
    return await resendVerificationCode(email as any);
  })
  const [resendtimer, setResendTimer] = useState(0)
  

  const handleInp = (e: any) => {
    const val = e.target.value;
    const name = e.target.name;
    setInpVal((prev) => ({ ...prev, [name]: val }));
    const nextInputId = e.target.nextElementSibling?.id;
    const prevInputId = e.target.previousElementSibling?.id;

    val && document.getElementById(nextInputId)?.focus();
    val.length === 0 && document.getElementById(prevInputId)?.focus();
  };

  const handleOnPaste = () => {
    window.addEventListener("paste", (e: any) => {
      e.preventDefault();
      const pastedValue = e.clipboardData.getData("text");
      const reg = new RegExp(/^\d+$/g);

      if (reg.test(pastedValue) && !isNaN(parseInt(pastedValue))) {
        const splitted = pastedValue.toString().split("");
        setInpVal({
          pad1: splitted[0] ?? "",
          pad2: splitted[1] ?? "",
          pad3: splitted[2] ?? "",
          pad4: splitted[3] ?? "",
          pad5: splitted[4] ?? "",
          pad6: splitted[5] ?? "",
        });
      }
    });
  };

  useEffect(() => {
    handleOnPaste();
  }, []);

  useEffect(()=>{
    if(typeof verifyMutation.data === "undefined") return;
    handleServerResponse()
  },[verifyMutation.data])

  useEffect(()=>{
    if(typeof resendCodeMutation.data === "undefined") return;
    handleResendServerRes()
  },[resendCodeMutation.data])

  function handleVerifyEmail(){
    verifyMutation.mutate(verifyCode as any);
  }

  async function handleServerResponse(){
    const {data} = verifyMutation;
    const response = data?.data ?? data;

    if(typeof response?.code === "undefined"){
      toast.error(`Something went wrong: ${response?.message}`)
      return;
    } 
    switch (response?.code) {
      case "--verification/invalid-token":
        toast.error("Invalid Code")
        break;
      case "--verification/token-expired":
        toast.error("Code has expired.")
        break;
      case "--verification/error-verifying-email":
        toast.error("Something went wrong, try again later.")
        break;
      case "--verification/email-verified":
        toast.success("Email verified successfully.")
        await sleep(1)
        router.push("/auth/login")
        break;
      default:
        console.log("omething went wrong")
        break;
    }
  }
  
  const requestNewCode = ()=>{
    const email = localStorage.getItem("temp_user");
    resendCodeMutation.mutate(email as any);
    setResendTimer(5)
  }

  function handleResendServerRes(){
    const {data} = resendCodeMutation;
    const response = data?.data ?? data;

    if(typeof response?.code === "undefined"){
      toast.error(`Something went wrong: ${response?.message}`)
      return;
    } 
    switch (response?.code) {
      case "--verification/invalid-email":
        toast.error("failed to resend, invalid email")
        break;
      case "--verification/user-not-found":
        toast.error("failed to resend, user dont exists.")
        break;
      case "--verification/user-verified":
        toast.error("failed to resend code to verified user.")
        break;
      case "--verification/error-sending-verification":
        toast.error("Something went wrong, try again later.")
        break;
      case "--verification/verification-sent":
        toast.success("verification code sent.")
        break;
      default:
        console.log("something went wrong")
        break;
    }
  }

  return (
    <div className="w-full h-full flex flex-col items-center justify-center">
      <div
        id="card"
        className="w-[380px] fixed top-0 z[1000] h-auto md:w-[400px] mt-8"
      >
        <div className="w-full flex items-start justify-start px-2 py-3">
          <Link href="/auth/register"><MdOutlineKeyboardBackspace className="text-3xl cursor-pointer text-white-300 p-1 rounded-md " /></Link>
        </div>
        <div className="w-full px-3 py-3 mt-1 flex flex-start justify-start flex-col">
          <h2 className="text-white-100 text-3xl veryBold pp-RG">
            One more thing...
          </h2>
          <p className="text-white-200 text-1xl pp-RG mt-2 ">
            We've sent a 6 digit code to your email address.
          </p>
        </div>
        <div className="mt-[4em] px-3 flex items-center justify-start gap-3">
          <input
            id="pad1"
            name="pad1"
            className="w-[55px] h-[50px] bg-dark-300 px-4 py-2 inpPad rounded-md border-2 border-solid border-white-200 flex flex-col items-center justify-center text-white-100 text-2xl "
            value={inpVal["pad1"]}
            maxLength={1}
            onChange={handleInp}
            disabled={verifyMutation.isLoading}
          />
          <input
            id="pad2"
            name="pad2"
            className="w-[55px] h-[50px] bg-dark-300 px-4 py-2 inpPad rounded-md border-2 border-solid border-white-200 flex flex-col items-center justify-center text-white-100 text-2xl "
            value={inpVal["pad2"]}
            maxLength={1}
            onChange={handleInp}
            disabled={verifyMutation.isLoading}
          />
          <input
            id="pad3"
            name="pad3"
            className="w-[55px] h-[50px] bg-dark-300 px-4 py-2 inpPad rounded-md border-2 border-solid border-white-200 flex flex-col items-center justify-center text-white-100 text-2xl "
            value={inpVal["pad3"]}
            maxLength={1}
            onChange={handleInp}
            disabled={verifyMutation.isLoading}
          />
          <input
            id="pad4"
            name="pad4"
            className="w-[55px] h-[50px] bg-dark-300 px-4 py-2 inpPad rounded-md border-2 border-solid border-white-200 flex flex-col items-center justify-center text-white-100 text-2xl "
            value={inpVal["pad4"]}
            maxLength={1}
            onChange={handleInp}
            disabled={verifyMutation.isLoading}
          />
          <input
            id="pad5"
            name="pad5"
            className="w-[55px] h-[50px] bg-dark-300 px-4 py-2 inpPad rounded-md border-2 border-solid border-white-200 flex flex-col items-center justify-center text-white-100 text-2xl "
            value={inpVal["pad5"]}
            maxLength={1}
            onChange={handleInp}
            disabled={verifyMutation.isLoading}
          />
          <input
            id="pad6"
            name="pad6"
            className="w-[55px] h-[50px] bg-dark-300 px-4 py-2 inpPad rounded-md border-2 border-solid border-white-200 flex flex-col items-center justify-center text-white-100 text-2xl "
            value={inpVal["pad6"]}
            maxLength={1}
            onChange={handleInp}
            disabled={verifyMutation.isLoading}
          />
        </div>
        <div className="w-full mt-[3rem] ml-1 px-1 h-auto flex flex-col items-center justify-center">
          <button className={`w-full flex flex-col items-center justify-center px-4 py-3 rounded-md bg-blue-105  ${verifyCode.length === 6 ? "opacity-1" : "opacity-[.5] pointer-events-none"}  text-white-100 text-center`} onClick={handleVerifyEmail}>
            {
              verifyMutation.isLoading ? <Spinner color="#fff" /> : "Verify Email"
            }
          </button>
        </div>
        <div className="mt-9 flex flex-col items-center justify-center">
          <p className="text-white-200 text-[12px] ">Did'nt received the code?</p>
          {
            resendtimer === 0 ?
            <p className="text-white-200 text-[12px] mt-5 underline cursor-pointer " onClick={requestNewCode}>Resend it</p>
            :
            <p className="text-white-200 text-[12px] mt-5">
              <MiniTimer time={resendtimer} action={()=> setResendTimer(0)} />
            </p>
          }
        </div>
      </div>
    </div>
  );
}

export default VerifyMail;


interface MiniTimerProp {
  time?: number;
  action(): void;
}


function MiniTimer({ time, action }: MiniTimerProp) {
  const [timer, setTimer] = useState<number>(time as number);

  useEffect(() => {
    const timeInterval = setInterval(() => {
      if (timer <= 0) {
        action();
        clearInterval(timeInterval);
        return;
      }
      setTimer((prev: number) => (prev -= 1));
    }, 1000);

    return () => clearInterval(timeInterval);
  }, [timer]);

  return <>{`Resending in ${timer}`}</>;
}
