import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/App.css";

import { useState, useEffect, useRef } from "react";
import Pagination from "../components/Pagination";
import ProductModal from "../components/ProductModal";
import DeleteModal from "../components/DeleteModal";

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

function ProductPage({}) {
	const [productList, setProductList] = useState([]);

	const [productToDelete, setProductToDelete] = useState("");
	const [pageInfo, setPageInfo] = useState({});

	const [isNewProduct, setIsNewProduct] = useState(true);
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
		imagesUrl: [""],
	});

	const modalRef = useRef(null);
	const productModalRef = useRef(null);
	const delModalRef = useRef(null);
	const deleteModalRef = useRef(null);

	//產品編輯頁
	useEffect(() => {
		getProductList();
        setProductToDelete("");
	}, []);
    
	//取得產品列表
	const getProductList = async (page = 1) => {
		try {
			const response = await axios.get(
				`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/products?page=${page}`
			);
			setProductList(response.data.products);
			setPageInfo(response.data.pagination);
		} catch (error) {
			console.log(error.response.data);
		}
	};
	//打開Modal並判斷是否為新增商品
	const openProductModal = (item = null) => {
		if (item) {
			setIsNewProduct(false);
			setTempProduct({ ...item });
		} else {
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
				imagesUrl: [""],
			});
		}
		productModalRef.current.show();
	};

	const openDeleteModal = () => {
		delModalRef.current.show();
	};

	return (
		<>
			<div>
				<div className="container">
					<div className="text-end mt-4">
						<button
							type="button"
							className="btn btn-primary"
							onClick={() => {
								openProductModal();
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
													onClick={() => {
														openProductModal(item);
													}}
												>
													編輯
												</button>
												<button
													type="button"
													className="btn btn-outline-danger btn-sm"
													onClick={() => {
														setProductToDelete(
															`${item.id}`
														);
														openDeleteModal();
													}}
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
					<Pagination
						getProductList={getProductList}
						pageInfo={pageInfo}
					></Pagination>
				</div>
			</div>
			<ProductModal
				isNewProduct={isNewProduct}
				tempProduct={tempProduct}
				setTempProduct={setTempProduct}
				modalRef={modalRef}
				productModalRef={productModalRef}
				getProductList={getProductList}
                pageInfo={pageInfo}
			></ProductModal>

			<DeleteModal
				deleteModalRef={deleteModalRef}
				delModalRef={delModalRef}
				productToDelete={productToDelete}
                getProductList={getProductList}
                pageInfo={pageInfo}
			></DeleteModal>
		</>
	);
}

export default ProductPage;
