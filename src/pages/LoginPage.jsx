import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/App.css";

import { useEffect, useState } from "react";

const { VITE_API_BASE } = import.meta.env;

function LoginPage({ setIsAuth }) {
    const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});
    //登入頁
	const handleLoginInputChange = (e) => {
		const { id, value } = e.target;
		setLoginData((prevData) => ({
			...prevData,
			[id]: value,
		}));
	};
	const handleSubmit = async (e) => {
		e.preventDefault();
		try {
			const response = await axios.post(
				`${VITE_API_BASE}/admin/signin`,
				loginData
			);
			const { token, expired } = response.data;
			document.cookie = `loginToken=${token};expires=${new Date(
				expired
			)}`;
			axios.defaults.headers.common.Authorization = token;
			setIsAuth(true);
		} catch (error) {
			alert(`登入失敗：` + error.response.data.message);
		}
	};
    const checkAdmin = async (e) => {
		try {
			await axios.post(`${VITE_API_BASE}/api/user/check`);
			setIsAuth(true);
		} catch (error) {
			console.log(error.response.data);
		}
	};
	useEffect(() => {
		const token = document.cookie.replace(
			/(?:(?:^|.*;\s*)loginToken\s*=\s*([^;]*).*$)|^.*$/,
			"$1"
		);
		axios.defaults.headers.common.Authorization = token;
        checkAdmin();
	}, []);
	return (
		<div className="container login">
			<div className="row justify-content-center">
				<h1 className="h3 mb-3 font-weight-normal">請先登入</h1>
				<div className="col-8">
					<form
						id="form"
						className="form-signin"
						onSubmit={handleSubmit}
					>
						<div className="form-floating mb-3">
							<input
								type="email"
								className="form-control"
								id="username"
								placeholder="name@example.com"
								value={loginData.username}
								onChange={handleLoginInputChange}
								required
								autoFocus
							/>
							<label htmlFor="username">Email address</label>
						</div>
						<div className="form-floating">
							<input
								type="password"
								className="form-control"
								id="password"
								placeholder="Password"
								value={loginData.password}
								onChange={handleLoginInputChange}
								required
							/>
							<label htmlFor="password">Password</label>
						</div>
						<button
							className="btn btn-lg btn-primary w-100 mt-3"
							type="submit"
						>
							登入
						</button>
					</form>
				</div>
			</div>
			<p className="mt-5 mb-3 text-muted">&copy; 2024~∞ - 六角學院</p>
		</div>
	);
}

export default LoginPage;
