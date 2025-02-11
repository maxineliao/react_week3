import "bootstrap/dist/css/bootstrap.css";
import "./assets/App.css";

import { useState } from "react";
import LoginPage from "./pages/LoginPage";
import ProductPage from "./pages/ProductPage";


function App() {
	
	const [isAuth, setIsAuth] = useState(false);
	
	return (
		<>
			{isAuth ? (
				<ProductPage></ProductPage>
			) : (
				<LoginPage setIsAuth={setIsAuth}></LoginPage>
			)}
		</>
	);
}

export default App;
