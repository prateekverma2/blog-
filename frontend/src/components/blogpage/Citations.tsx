const Citations: React.FC<{ citations?: string[] }> = ({ citations }) => {
  if (!citations || citations.length === 0) {
    return (
      <div className="bg-card rounded-lg shadow-sm p-4 border mt-4">
        <h3 className="text-lg font-medium mb-2">References</h3>
        <p className="text-sm text-muted-foreground">No references available.</p>
      </div>
    );
  }

  return (
    <div className="bg-card rounded-lg shadow-sm p-4 border mt-4">
      <h3 className="text-lg font-medium mb-2">References</h3>
      <ul className="list-disc pl-5 text-sm text-blue-400">
        {citations.map((ref, index) => (
          <li key={index}>
            <a href={ref} target="_blank" rel="noopener noreferrer" className="hover:underline">
              {ref}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default Citations;