var axiosone = require("../.");

function logResponse(requestPromise, queryName) {
  requestPromise
    .then(function (response) {
      console.log("[success " + queryName + "]: ", response.data);
      console.log("--------------------------");
    })
    .catch(function (err) {
      console.log(
        "[error " + queryName + "]: ",
        err.response.status + " - " + err.response.statusText
      );
      console.log("--------------------------");
    });
}

axiosone.extendGlobalConfig({
  baseURL: "http://localhost:3001",
});

axiosone.bindConfig({
  getPosts: {
    method: "get",
    url: "/posts",
  },

  addPost: function (text) {
    return {
      method: "post",
      url: "/posts",
      data: {
        text: text,
      },
    };
  },

  updatePost: function (id, text) {
    return {
      method: "put",
      url: "/posts/" + id,
      data: {
        text: text,
      },
    };
  },

  deletePost: function (id) {
    return {
      method: "delete",
      url: "/posts/" + id,
    };
  },
});

// Clear existing posts, if no post(s) will just
// simply return 404.
logResponse(axiosone.deletePost(1), "deletePost");
logResponse(axiosone.deletePost(2), "deletePost");
logResponse(axiosone.deletePost(3), "deletePost");

logResponse(axiosone.addPost("first post"), "addPost");
logResponse(axiosone.addPost("second post"), "addPost");
logResponse(axiosone.addPost("third post"), "addPost");
logResponse(axiosone.getPosts(), "getPosts");
logResponse(axiosone.updatePost(1, "update first post"), "updatePost");
logResponse(axiosone.updatePost(3, "update last post"), "updatePost");
logResponse(axiosone.getPosts(), "getPosts");
