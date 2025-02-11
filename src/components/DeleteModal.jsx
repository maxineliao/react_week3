import axios from "axios";
import "bootstrap/dist/css/bootstrap.css";
import "../assets/App.css";
import { useEffect } from "react";
import { Modal } from "bootstrap";
const { VITE_API_BASE, VITE_API_PATH } = import.meta.env;

//處理Modal aria-hidden問題
window.addEventListener("hide.bs.modal", () => {
	if (document.activeElement instanceof HTMLElement) {
		document.activeElement.blur();
	}
});

function DeleteModal({ 
    deleteModalRef, 
    delModalRef, 
    productToDelete,
    getProductList,
    pageInfo
}) {
	useEffect(() => {
		delModalRef.current = new Modal(deleteModalRef.current);
	}, []);
	const dismissDeleteModal = () => {
		delModalRef.current.hide();
	};

	//刪除商品api
	const deleteProduct = async () => {
		try {
			const res = await axios.delete(
				`${VITE_API_BASE}/api/${VITE_API_PATH}/admin/product/${productToDelete}`
			);
			await getProductList(pageInfo.current_page);
			alert("商品刪除成功！");
			dismissDeleteModal();
		} catch (error) {
			alert(`商品刪除失敗：${error.response.data.message}`);
		}
	};
	return (
		<div className="modal" tabIndex="-1" ref={deleteModalRef}>
			<div className="modal-dialog">
				<div className="modal-content">
					<div className="modal-header">
						<h5 className="modal-title">刪除商品</h5>
						<button
							type="button"
							className="btn-close"
							data-bs-dismiss="modal"
							aria-label="Close"
						></button>
					</div>
					<div className="modal-body">
						<p>商品刪除後無法復原，確認要刪除嗎？</p>
					</div>
					<div className="modal-footer">
						<button
							type="button"
							className="btn btn-outline-secondary"
							onClick={dismissDeleteModal}
						>
							取消
						</button>
						<button
							type="button"
							className="btn btn-danger"
							onClick={() => {
								deleteProduct(productToDelete);
							}}
						>
							刪除
						</button>
					</div>
				</div>
			</div>
		</div>
	);
}

export default DeleteModal;
