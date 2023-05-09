import { MdError, MdCheckCircle } from "react-icons/md";

interface ResponseCompType {
  labelBtn?: string;
  action?: () => void;
  title?: string;
  description?: string;
  showIcon?: boolean;
}

export function ErrorMessageComp({
  labelBtn,
  action,
  description,
  showIcon,
  title,
}: ResponseCompType) {
  return (
    <div id="card" className="w-full md:w-full rounded-md px-2 py-6 ">
      <div
        id="head"
        className="w-full flex flex-col items-center justify-center"
      >
        {showIcon && (
          <MdError className="text-[3rem] text-red-200 rounded-[50%] mb-5 " />
        )}
      </div>
      <div className="w-full flex-col items-center justify-center text-center">
        <p className="text-[20px] md:text-2xl font-extrabold text-white-100 veryBold">{title}</p>
        {description !== "" && (
          <p className="text-[12px] mt-4 text-white-300">
            {description ?? "some error description"}
          </p>
        )}
        {labelBtn !== "" && typeof action !== "undefined" && (
          <button
            className={`w-full bg-blue-200 text-center px-5 py-3 rounded-[30px] mt-6 transition-all scale-[.89] hover:scale-[1] `}
            onClick={action}
          >
            {labelBtn ?? "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}

export function SuccessMessageComp({
  labelBtn,
  action,
  description,
  showIcon,
  title,
}: ResponseCompType) {
  return (
    <div id="card" className="w-[350px] md:w-[400px] rounded-md px-8 py-6 ">
      <div
        id="head"
        className="w-full flex flex-col items-center justify-center"
      >
        {showIcon && (
          <MdCheckCircle className="text-[3rem] text-blue-200 mb-5 rounded-[50%] " />
        )}
      </div>
      <div className="w-full flex-col items-center justify-center text-center">
        <p className="text-[20px] md:text-2xl text-white-100 veryBold">{title}</p>
        {description !== "" && (
          <p className="text-[12px] mt-4 text-white-300">
            {description ?? "some error description"}
          </p>
        )}
        {labelBtn !== "" && typeof action !== "undefined" && (
          <button
            className={`w-full bg-blue-200 text-center px-5 py-3 rounded-[30px] mt-6 transition-all scale-[.89] hover:scale-[1] `}
            onClick={action}
          >
            {labelBtn ?? "Continue"}
          </button>
        )}
      </div>
    </div>
  );
}
