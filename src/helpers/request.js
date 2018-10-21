const Request = function (url) {
  this.url = url;
}

Request.prototype.get = function () {
  return fetch(this.url).then(response => response.json()).catch(err => console.log(err));
};

module.exports = Request;
