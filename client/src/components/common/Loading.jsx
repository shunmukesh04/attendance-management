const Loading = ({ message = 'Loading...' }) => {
  return (
    <div className="loading">
      <div>{message}</div>
    </div>
  );
};

export default Loading;

