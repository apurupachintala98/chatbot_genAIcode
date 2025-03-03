import './App.css';
import "bootstrap/dist/css/bootstrap.min.css";
import Dashboard from './pages/Dashboard';


function App() {
  const apiUrl = "https://arbassist.edagenaidev.awsdns.internal.das/backend/get_llm_response/";
  const uploadApiUrl = "https://arbassist.edagenaidev.awsdns.internal.das/upload_file/";
  const feedbackUrl = "http://10.126.192.122:8100/get_llm_feedback/";
  const fullPayloadUrl = "https://arbassist.edagenaidev.awsdns.internal.das/backend/get_full_payload/";
  return (
    <><Dashboard apiUrl={apiUrl} uploadApiUrl={uploadApiUrl} feedbackUrl={feedbackUrl} fullPayloadUrl={fullPayloadUrl} />
    </>
  );
}

export default App;
