
import axios from 'axios';

const Task = ({ task, csvPart }) => {

   const backendUrl = import.meta.env.VITE_BACKEND_URL;

  const downloadCSV = async (csvPart) => {
    try {
      const response = await axios.post(`${backendUrl}/user/downloadcsv`, { csvPart  }, {
        responseType: 'blob',
      });

      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', `task_${task._id}.csv`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("Download failed:", error);
    }
  };

  return (
    <div className="border border-gray-300 shadow-md p-6 rounded-xl max-w-xl bg-white hover:shadow-lg transition duration-200">
      <h3 className="text-xl font-bold text-emerald-700 mb-2">{task.name.charAt(0).toUpperCase() + task.name.slice(1)}</h3>
      <p className="text-gray-700 mb-2">{task.description}</p>
      
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">Start:</span> {new Date(task.start_date).toLocaleDateString()}
      </div>
      <div className="text-sm text-gray-600 mb-2">
        <span className="font-medium">End:</span> {new Date(task.end_date).toLocaleDateString()}
      </div>

      <p onClick={() => downloadCSV(csvPart)} className="flex mb-2 text-blue-400 cursor-pointer hover:underline">
        ⬇ Click to download your CSV slice
      </p>
      
      <div className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
        task.status === 'Completed' ? 'bg-green-100 text-green-700' :
        task.status === 'In Progress' ? 'bg-yellow-100 text-yellow-700' :
        'bg-red-100 text-red-700'
      }`}>
        {task.status}
      </div>
    </div>
  );
};

export default Task;
