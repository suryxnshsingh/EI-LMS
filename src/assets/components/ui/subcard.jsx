import { Book } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SubCard = ({ id, code, name }) => {
  const navigate = useNavigate();
  return (
    <div
      onClick={() => {
        navigate(`${id}`);
      }}
      className="w-full p-4 rounded border-[1px] border-slate-300 dark:border-neutral-700 relative overflow-hidden group bg-neutral-100 dark:bg-neutral-950"
    >
      <div className="absolute inset-0 bg-gradient-to-r from-violet-600 to-indigo-600 translate-y-[100%] group-hover:translate-y-[0%] transition-transform duration-300" />

      <Book className=" mb-12 h-8 w-8 text-violet-600 group-hover:text-white transition-colors relative z-10 duration-300" />
      <h3 className="font-medium text-2xl text-slate-950 dark:text-neutral-200 group-hover:text-white relative z-10 duration-300">
        {name}
      </h3>
      <p className="text-slate-400 group-hover:text-violet-200 relative z-10 duration-300">
        {code}
      </p>
    </div>
  );
};

export default SubCard;