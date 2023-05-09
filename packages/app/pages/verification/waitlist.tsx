import { useRouter } from "next/router";
import Navbar from "../../components/Navbar/navbar";
import { LoaderModal } from "../../components/Loader";
import { useQuery } from "react-query";
import { verifyEmail } from "../../http";
import getServerResponseMessage from "../../util/getServerMessage";
import {
  ErrorMessageComp,
  SuccessMessageComp,
} from "../../components/Response";

function Waitlist() {
  const router = useRouter();
  const token: any = router.query.token;

  const { isLoading, error, status, data } = useQuery(
    ["verifyWaitlistEmail", token],
    async () => {
      const validatedToken = validateToken(token)
      return await verifyEmail(validatedToken);
    },
    {
      enabled: token?.length > 0,
    }
  );
  let ResponseComponent: JSX.Element | null = null;

  if (isLoading) {
    return <LoaderModal />;
  }

  if (typeof token === "undefined" && ["idle", "error"].includes(status)) {
    ResponseComponent = (
      <ErrorMessageComp
        title={"Invalid Token"}
        description={"Verification token is missing."}
        showIcon={true}
      />
    );
  }

  if (status === "error" && typeof data === "undefined") {
    ResponseComponent = (
      <ErrorMessageComp
        title="Something Went wrong"
        description="Something went wrong verifying token, try again later."
        showIcon={true}
      />
    );
  }

  if (status === "success" && typeof data !== "undefined") {
    const { code, errorStatus } =
      typeof data.data !== "undefined" ? data.data : data;
    const { desc, title } = getServerResponseMessage({ code, errorStatus });
    ResponseComponent = errorStatus ? (
      <ErrorMessageComp title={title} description={desc} showIcon={true} />
    ) : (
      <SuccessMessageComp title={title} description={desc} showIcon={true} />
    );
  }

  // console.log({error, data, status})

  return (
    <div className="w-full h-[100vh] flex flex-col items-center justify-center ">
      <Navbar showLogo={true} showSocials={true} />
      <div className="fixed top-0 left-0 z-[100] w-full h-[100vh] flex flex-col items-center justify-center">
        {ResponseComponent}
      </div>
    </div>
  );
}

export default Waitlist;


function validateToken(token: string){
  const reg = new RegExp(/^[a-z0-9]{20}/ig);
  const match = reg.test(token);
  return match ? token : "invalid"
}