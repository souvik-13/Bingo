import BingoLogo from "/Bingo-logos/Bingo-logos_transparent.png";
const Navbar = () => {
  return (
    <div className=" flex w-full gap-1 border-b-[0.5px] items-center p-3">
      {/* Logo portion */}
      <div className="">
        <img src={BingoLogo} alt="Bingo Logo" className=" w-[100px]" />
      </div>
      {/*Next button*/}
      <div className="grow flex items-center justify-center">
        <button
        // className="bg-[#F5F5F5] hover:bg-[#EDEDED] text-black font-bold py-2 px-4 rounded-full"
        >
          Next
        </button>
      </div>
      {/* sign in */}
      <div className="">
        <a href="/sign-in" className="">
          <button
          // className="bg-[#F5F5F5] hover:bg-[#EDEDED] text-black font-bold py-2 px-4 rounded-full"
          >
            Sign In
          </button>
        </a>
      </div>
    </div>
  );
};

export default Navbar;
