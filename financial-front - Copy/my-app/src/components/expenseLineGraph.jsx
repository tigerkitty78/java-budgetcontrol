import Linegraph from './linegraph';

const categories = ['Food', 'Transport', 'Utilities', 'Entertainment'];

const ExpenseGraphs = () => {
  return (
    <div>
      {categories.map((category) => (
        <div key={category} style={{ marginBottom: '20px' }}>
          <h3>{category} Expenses</h3>
          <Linegraph category={category} />
        </div>
      ))}
    </div>
  );
};

export default ExpenseGraphs;
