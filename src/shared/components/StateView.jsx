const StateView = ({ loading, error, children }) => {
  if (loading) {
    return (
      <div className="d-flex justify-content-center py-5">
        <div className="spinner-border sub-color" role="status" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="alert alert-danger my-3" role="alert">
        {error}
      </div>
    );
  }

  return children;
};

export default StateView;
