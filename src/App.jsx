import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "./assets/App.css";

import { useState, useEffect, useRef } from "react";
import { Modal } from "bootstrap";

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

//處理Modal aria-hidden問題
window.addEventListener('hide.bs.modal', () => {
    if (document.activeElement instanceof HTMLElement) {
        document.activeElement.blur();
    }
});
function App() {
	const [loginData, setLoginData] = useState({
		username: "",
		password: "",
	});
	const [isAuth, setIsAuth] = useState(false);
	const [productList, setProductList] = useState([]);
	const [tempProduct, setTempProduct] = useState({
        title: "",
        category: "",
        origin_price: 0,
        price: 0,
        unit: "",
        description: "",
        content: "",
        is_enabled: 1,
        imageUrl: "",
        imagesUrl: [
            ""
        ],
	});
    const [isNewProduct, setIsNewProduct] = useState(true);
    const [productToDelete, setProductToDelete] = useState('');

	const modalRef = useRef(null);
	const productModalRef = useRef(null);
    const initialRenderRef = useRef(true);

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
		productModalRef.current = new Modal(modalRef.current);
		checkAdmin();
        setProductToDelete('');
	}, []);

	//產品編輯頁
	useEffect(() => {
        getProductList();
	}, [isAuth]);
    //取得產品列表
    const getProductList = async () => {
        try {
            const response = await axios.get(
                `${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products`
            );
            setProductList(response.data.products);
        } catch (error) {
            console.log(error.response.data);
        }
    };
     //打開Modal並判斷是否為新增商品
    const openProductModal = (item = null) => {
        if (item) {
            setIsNewProduct(false);
            setTempProduct({...item});
        }else {
            setIsNewProduct(true);
            setTempProduct({
                title: "",
                category: "",
                origin_price: 0,
                price: 0,
                unit: "",
                description: "",
                content: "",
                is_enabled: 1,
                imageUrl: "",
                imagesUrl: [
                    ""
                ],
                }
            );   
        }
        productModalRef.current.show();
    };
    //關閉Modal
    const dismissProductModal = ()=>{
        productModalRef.current.hide();
    }
    
    //處理Modal內資料
    const handleModalInputChange = (e) => {
		const { id, value, checked, type } = e.target;
		setTempProduct((prevData) => ({
			...prevData,
			[id]: type ==="checkbox" ? checked : type ==='number' ? Number(value) : value,
		}));
	};
    //處理Modal內副圖資料
    const handleModalImgChange = (e, index) =>{
        const { value } = e.target;
        const newImages = [...tempProduct.imagesUrl];
        newImages[index] = value;
        setTempProduct((prevData) => ({
			...prevData,
			imagesUrl: newImages
		}));
    }
    //增減附圖數量
    const addImagesInput =()=>{
        const newImages = [...tempProduct.imagesUrl];
        newImages[tempProduct.imagesUrl.length] = "";
        setTempProduct((prevData) => ({
			...prevData,
			imagesUrl: newImages
		}));
    }
    const deleteImagesInput =()=>{
        const newImages = [...tempProduct.imagesUrl];
        newImages.pop();
        setTempProduct((prevData) => ({
			...prevData,
			imagesUrl: newImages
		}));
    }
    //新增商品api
    const handleNewProductSubmit = async()=>{
        const submitData = {"data":{...tempProduct}}
        try {
            const res = await axios.post(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product`,submitData);
            dismissProductModal();
            //確保畫面更新
            await getProductList();
            alert(`新增商品成功！`)
        } catch (error) {
            alert(`新增商品失敗：${error.response.data.message}`)
        }
    }
    //修改商品api
    const handleExistedProductSubmit = async()=>{
        const submitData = {"data":{...tempProduct}}
        try {
            const res = await axios.put(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${tempProduct.id}`,submitData);
            dismissProductModal();
            //確保畫面更新
            await getProductList();
            alert(`修改成功！`);
        } catch (error) {
            alert(`修改商品失敗：${error.response.data.message}`)
        }
    }
    //刪除商品api
    const deleteProduct = async()=>{
        try {
            const res = await axios.delete(`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${productToDelete}`)
            await getProductList();
            alert('刪除商品成功！');
        } catch (error) {
            alert(`刪除商品失敗：${error.response.data.message}`)
        }
    }
    useEffect(()=>{
        if (!productToDelete) return;
        deleteProduct();
    },[productToDelete])

	return (
		<>
			{isAuth ? (
				<div>
					<div className="container">
						<div className="text-end mt-4">
							<button
								type="button"
								className="btn btn-primary"
								onClick={()=>{
                                    setIsNewProduct(true);
                                    openProductModal()
                                }}
							>
								建立新的產品
							</button>
						</div>
						<table className="table mt-4">
							<thead>
								<tr>
									<th width="120">分類</th>
									<th>產品名稱</th>
									<th width="120">原價</th>
									<th width="120">售價</th>
									<th width="100">是否啟用</th>
									<th width="120">編輯</th>
								</tr>
							</thead>
							<tbody>
								{productList && productList.length > 0 ? (
									productList.map((item) => (
										<tr key={item.id}>
											<td>{item.category}</td>
											<td>{item.title}</td>
											<td className="text-end">
												{item.origin_price}
											</td>
											<td className="text-end">
												{item.price}
											</td>
											<td>
												{item.is_enabled ? (
													<span className="text-success">
														啟用
													</span>
												) : (
													<span>未啟用</span>
												)}
											</td>
											<td>
												<div className="btn-group">
													<button
														type="button"
														className="btn btn-outline-primary btn-sm"
                                                        onClick={()=>{
                                                            setIsNewProduct(false);
                                                            openProductModal(item)
                                                        }}
													>
														編輯
													</button>
													<button
														type="button"
														className="btn btn-outline-danger btn-sm"
                                                        onClick={()=>{setProductToDelete(`${item.id}`)}}
													>
														刪除
													</button>
												</div>
											</td>
										</tr>
									))
								) : (
									<tr>
										<td colSpan="6">尚無產品資料</td>
									</tr>
								)}
							</tbody>
						</table>
					</div>
				</div>
			) : (
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
									<label htmlFor="username">
										Email address
									</label>
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
					<p className="mt-5 mb-3 text-muted">
						&copy; 2024~∞ - 六角學院
					</p>
				</div>
			)}
			<div
				id="productModal"
				className="modal fade"
				tabIndex="-1"
				aria-labelledby="productModalLabel"
				aria-hidden="true"
				ref={modalRef}
			>
				<div className="modal-dialog modal-xl">
					<div className="modal-content border-0">
						<div className="modal-header bg-dark text-white">
							<h5 id="productModalLabel" className="modal-title">
								<span>{isNewProduct ? `新增產品` : `編輯產品`}</span>
							</h5>
							<button
								type="button"
								className="btn-close"
								aria-label="Close"
                                onClick={dismissProductModal}
							></button>
						</div>
						<div className="modal-body">
							<div className="row">
								<div className="col-sm-4">
									<div className="mb-2">
										<div className="mb-3">
											<label
												htmlFor="imageUrl"
												className="form-label"
											>
												輸入主圖網址
											</label>
											<input
                                                id="imageUrl"
												type="text"
												className="form-control"
												placeholder="請輸入圖片連結"
                                                value={tempProduct.imageUrl}
                                                onChange={handleModalInputChange}
											/>
										</div>
                                        {tempProduct.imageUrl !=="" && <img
                                            className="img-fluid"
                                            src={tempProduct.imageUrl}
                                            alt={`主圖`}
                                        />}
									</div>
                                    <div className="mb-2">
										<div className="mb-3">
                                            {tempProduct.imagesUrl.map((image, index)=>(<div key={index}>
                                                <label
                                                    htmlFor={`imagesUrl-${index + 1}`}
                                                    className="form-label"
                                                >
                                                    {`副圖${index + 1}`}
                                                </label>
                                                <input
                                                    id={`imagesUrl-${index + 1}`}
                                                    value={image}
                                                    type="text"
                                                    className="form-control mb-2"
                                                    placeholder={`副圖${index + 1}連結`}
                                                    onChange={(e)=>(handleModalImgChange(e, index))}
                                                />
                                                {image !=="" && <img
                                                    className="img-fluid"
                                                    src={image}
                                                    alt={`副圖${index + 1}`}
                                                />}
                                            </div>
                                            ))}
										</div>
									</div>
									<div>
                                        {tempProduct.imagesUrl.length<5 && tempProduct.imagesUrl[tempProduct.imagesUrl.length - 1] !=="" && <button className="btn btn-outline-primary btn-sm d-block w-100 mb-1" onClick={addImagesInput}>
											新增圖片
										</button>}
									</div>
									<div>
                                        {tempProduct.imagesUrl.length>1 && <button className="btn btn-outline-danger btn-sm d-block w-100" onClick={deleteImagesInput}>
											刪除圖片
										</button>}
									</div>
								</div>
								<div className="col-sm-8">
									<div className="mb-3">
										<label
											htmlFor="title"
											className="form-label"
										>
											標題
										</label>
										<input
											id="title"
											type="text"
											className="form-control"
											placeholder="請輸入標題"
                                            onChange={handleModalInputChange}
                                            value={tempProduct.title}
										/>
									</div>

									<div className="row">
										<div className="mb-3 col-md-6">
											<label
												htmlFor="category"
												className="form-label"
											>
												分類
											</label>
											<input
												id="category"
												type="text"
												className="form-control"
												placeholder="請輸入分類"
                                                onChange={handleModalInputChange}
                                                value={tempProduct.category}
											/>
										</div>
										<div className="mb-3 col-md-6">
											<label
												htmlFor="unit"
												className="form-label"
											>
												單位
											</label>
											<input
												id="unit"
												type="text"
												className="form-control"
												placeholder="請輸入單位"
                                                onChange={handleModalInputChange}
                                                value={tempProduct.unit}
											/>
										</div>
									</div>

									<div className="row">
										<div className="mb-3 col-md-6">
											<label
												htmlFor="origin_price"
												className="form-label"
											>
												原價
											</label>
											<input
												id="origin_price"
												type="number"
												min="0"
												className="form-control"
												placeholder="請輸入原價"
                                                onChange={handleModalInputChange}
                                                value={tempProduct.origin_price}
											/>
										</div>
										<div className="mb-3 col-md-6">
											<label
												htmlFor="price"
												className="form-label"
											>
												售價
											</label>
											<input
												id="price"
												type="number"
												min="0"
												className="form-control"
												placeholder="請輸入售價"
                                                onChange={handleModalInputChange}
                                                value={tempProduct.price}
											/>
										</div>
									</div>
									<hr />

									<div className="mb-3">
										<label
											htmlFor="description"
											className="form-label"
										>
											產品描述
										</label>
										<textarea
											id="description"
											className="form-control"
											placeholder="請輸入產品描述"
                                            onChange={handleModalInputChange}
                                            value={tempProduct.description}
										></textarea>
									</div>
									<div className="mb-3">
										<label
											htmlFor="content"
											className="form-label"
										>
											說明內容
										</label>
										<textarea
											id="content"
											className="form-control"
											placeholder="請輸入說明內容"
                                            onChange={handleModalInputChange}
                                            value={tempProduct.content}
										></textarea>
									</div>
									<div className="mb-3">
										<div className="form-check">
											<input
												id="is_enabled"
												className="form-check-input"
												type="checkbox"
                                                onChange={handleModalInputChange}
                                                checked={tempProduct.is_enabled}
											/>
											<label
												className="form-check-label"
												htmlFor="is_enabled"
											>
												是否啟用
											</label>
										</div>
									</div>
								</div>
							</div>
						</div>
						<div className="modal-footer">
							<button
								type="button"
								className="btn btn-outline-secondary"
                                onClick={dismissProductModal}
							>
								取消
							</button>
							<button type="button" className="btn btn-primary" onClick={isNewProduct ? handleNewProductSubmit : handleExistedProductSubmit}>
								確認
							</button>
						</div>
					</div>
				</div>
			</div>
		</>
	);
}

export default App;
