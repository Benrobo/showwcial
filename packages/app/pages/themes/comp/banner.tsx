import ImageTag from "../../../components/Image";

function ShowwcialBanner() {
  return (
    <div className="w-auto h-auto px-3 py-1 flex items-center justify-center gap-3 bg-dark-900 backdrop-blur z-[100] fixed bottom-0 right-0 rounded-t-[10px] border-dashed border-[.5px] border-white-600 ">
      <ImageTag src="/images/logos/logo2.png" className="w-[20px] " />
      <a href="#" className="text-blue-300 pp-SB text-[10px] ">
        Built w/ Showwcial
      </a>
    </div>
  );
}

export default ShowwcialBanner;
