const RunStat = ({ title, data }: { title: String; data?: String }) => {
  return (
    <p>
      <span className="font-light">{title}</span> -{" "}
      <span className={"text-md"}>{data}</span>
    </p>
  );
};

export default RunStat;
