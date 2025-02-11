function Pagination(
    {getProductList, pageInfo}
) {
    //換頁功能處理
	const handlePageChange = (page) => {
		getProductList(page);
	};
	return (
		<nav aria-label="Page navigation">
			<ul className="pagination justify-content-center">
				<li className={`page-item ${!pageInfo.has_pre && "disabled"}`}>
					<a
						className="page-link"
						href="#"
						aria-label="Previous"
						onClick={() => {
							handlePageChange(pageInfo.current_page - 1);
						}}
					>
						<span aria-hidden="true">&laquo;</span>
					</a>
				</li>
				{Array.from({ length: pageInfo.total_pages }).map(
					(_, index) => {
						return (
							<li className="page-item" key={index}>
								<a
									className={`page-link ${
										index + 1 === pageInfo.current_page &&
										"active"
									}`}
									href="#"
									onClick={() => {
										handlePageChange(index + 1);
									}}
								>
									{index + 1}
								</a>
							</li>
						);
					}
				)}
				<li className={`page-item ${!pageInfo.has_next && "disabled"}`}>
					<a
						className="page-link"
						href="#"
						aria-label="Next"
						onClick={() => {
							handlePageChange(pageInfo.current_page + 1);
						}}
					>
						<span aria-hidden="true">&raquo;</span>
					</a>
				</li>
			</ul>
		</nav>
	);
}

export default Pagination;