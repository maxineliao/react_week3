import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import { useEffect } from "react";
import { Modal } from "bootstrap";

const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

//處理Modal aria-hidden問題
window.addEventListener("hide.bs.modal", () => {
	if (document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
	}
});

function ProductModal({
	isNewProduct,
	tempProduct,
	setTempProduct,
	modalRef,
	productModalRef,
	getProductList,
    pageInfo
}) {
	useEffect(() => {
		productModalRef.current = new Modal(modalRef.current);
	}, []);
	//關閉Modal
	const dismissProductModal = () => {
		productModalRef.current.hide();
	};

	//處理Modal內資料
	const handleModalInputChange = (e) => {
		const { id, value, checked, type } = e.target;
		setTempProduct((prevData) => ({
			...prevData,
			[id]:
				type === "checkbox"
					? checked
						? 1
						: 0
					: type === "number"
					? Number(value)
					: value,
		}));
	};
	//處理Modal內副圖資料
	const handleModalImgChange = (e, index) => {
		const { value } = e.target;
		const newImages = [...tempProduct.imagesUrl];
		newImages[index] = value;
		setTempProduct((prevData) => ({
			...prevData,
			imagesUrl: newImages,
		}));
	};
	//增減附圖數量
	const addImagesInput = () => {
		const newImages = [...tempProduct.imagesUrl];
		newImages[tempProduct.imagesUrl.length] = "";
		setTempProduct((prevData) => ({
			...prevData,
			imagesUrl: newImages,
		}));
	};
	const deleteImagesInput = () => {
		const newImages = [...tempProduct.imagesUrl];
		newImages.pop();
		setTempProduct((prevData) => ({
			...prevData,
			imagesUrl: newImages,
		}));
	};

	//新增商品api
	const handleNewProductSubmit = async () => {
		const submitData = { data: { ...tempProduct } };
		try {
			const res = await axios.post(
				`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product`,
				submitData
			);
			dismissProductModal();
			//確保畫面更新
			await getProductList();
			alert(`商品新增成功！`);
		} catch (error) {
			alert(`商品新增失敗：${error.response.data.message}`);
		}
	};
	//修改商品api
	const handleExistedProductSubmit = async () => {
		const submitData = { data: { ...tempProduct } };
		try {
			const res = await axios.put(
				`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${tempProduct.id}`,
				submitData
			);
			dismissProductModal();
			//確保畫面更新
			await getProductList(pageInfo.current_page);
			alert(`修改成功！`);
		} catch (error) {
			alert(`商品修改失敗：${error.response.data.message}`);
		}
	};
	return (
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
							<span>
								{isNewProduct ? `新增產品` : `編輯產品`}
							</span>
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
									{tempProduct.imageUrl !== "" && (
										<img
											className="img-fluid"
											src={tempProduct.imageUrl}
											alt={`主圖`}
										/>
									)}
								</div>
								<div className="mb-2">
									<div className="mb-3">
										{tempProduct.imagesUrl.map(
											(image, index) => (
												<div key={index}>
													<label
														htmlFor={`imagesUrl-${
															index + 1
														}`}
														className="form-label"
													>
														{`副圖${index + 1}`}
													</label>
													<input
														id={`imagesUrl-${
															index + 1
														}`}
														value={image}
														type="text"
														className="form-control mb-2"
														placeholder={`副圖${
															index + 1
														}連結`}
														onChange={(e) =>
															handleModalImgChange(
																e,
																index
															)
														}
													/>
													{image !== "" && (
														<img
															className="img-fluid"
															src={image}
															alt={`副圖${
																index + 1
															}`}
														/>
													)}
												</div>
											)
										)}
									</div>
								</div>
								<div>
									{tempProduct.imagesUrl.length < 5 &&
										tempProduct.imagesUrl[
											tempProduct.imagesUrl.length - 1
										] !== "" && (
											<button
												className="btn btn-outline-primary btn-sm d-block w-100 mb-1"
												onClick={addImagesInput}
											>
												新增圖片
											</button>
										)}
								</div>
								<div>
									{tempProduct.imagesUrl.length > 1 && (
										<button
											className="btn btn-outline-danger btn-sm d-block w-100"
											onClick={deleteImagesInput}
										>
											刪除圖片
										</button>
									)}
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
						<button
							type="button"
							className="btn btn-primary"
							onClick={
								isNewProduct
									? handleNewProductSubmit
									: handleExistedProductSubmit
							}
						>
							確認
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default ProductModal;
