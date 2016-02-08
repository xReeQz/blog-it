

exports.createdAt = getCreateDate;


function getCreateDate() {
	return this._id.getTimestamp();
}