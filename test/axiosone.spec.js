var MockAdapter = require("axios-mock-adapter");

var axiosone = require("../.");

var mock = new MockAdapter(axiosone.axios);

var posts = [
  { id: 1, text: "first post" },
  {
    id: 2,
    text: "second post",
  },
  {
    id: 3,
    text: "third post",
  },
];

describe("axiosone", function () {
  it("Can extend axios default config", function () {
    var defaults = axiosone.axios.defaults;
    var headers = {
      Authorization: "abcd",
    };
    var globalConfig = {
      baseURL: "http://localhost:1234",
      headers: headers,
    };

    expect(defaults.baseURL).toBeUndefined();
    expect(defaults.headers.Authorization).toBeUndefined();

    axiosone.extendGlobalConfig(globalConfig);
    expect(axiosone.axios.defaults).toEqual(
      Object.assign(defaults, globalConfig)
    );
  });

  it("Should bind simple config", function () {
    axiosone.bindConfig({
      getPosts: {
        method: "get",
        url: "/posts",
      },
    });
    expect(axiosone.getPosts).toBeInstanceOf(Function);
    mock.onGet("/posts").reply(200, {
      posts: posts,
    });
    axiosone.getPosts().then(function (res) {
      expect(res.config.method).toEqual("get");
      expect(res.config.url).toEqual("/posts");
    });
  });

  it("Should bind list of configs", function () {
    axiosone.bindConfig({
      getOnePost: [
        {
          method: "get",
        },
        {
          url: "/posts/1",
        },
      ],
    });
    expect(axiosone.getOnePost).toBeInstanceOf(Function);
    mock.onGet("/posts/1").reply(200, {
      post: posts[0],
    });
    axiosone.getOnePost().then(function (res) {
      expect(res.config.method).toEqual("get");
      expect(res.config.url).toEqual("/posts/1");
    });
  });

  it("Should bind a function that returns a config object", function () {
    var expectedText = "testing123";
    axiosone.bindConfig({
      updatePost: function (text) {
        return {
          method: "patch",
          url: "/posts/1",
          data: text,
        };
      },
    });
    expect(axiosone.updatePost).toBeInstanceOf(Function);
    mock.onAny("/posts/1").reply(200, {
      post: Object.assign(posts[0], {
        text: expectedText,
      }),
    });
    axiosone.updatePost(expectedText).then(function (res) {
      expect(res.data).toEqual({
        post: {
          id: 1,
          text: expectedText,
        },
      });
      expect(res.config.method).toEqual("patch");
      expect(res.config.url).toEqual("/posts/1");
    });
  });

  it("Should bind a function that returns a list of config objects", function () {
    var expectedText = "testing123";
    axiosone.bindConfig({
      updatePost: function (text) {
        return [
          {
            method: "post",
            url: "/posts/1",
          },
          {
            data: text,
          },
        ];
      },
    });
    expect(axiosone.updatePost).toBeInstanceOf(Function);
    mock.onAny("/posts/1").reply(200, {
      post: Object.assign(posts[0], {
        text: expectedText,
      }),
    });
    axiosone.updatePost(expectedText).then(function (res) {
      expect(res.data).toEqual({
        post: {
          id: 1,
          text: expectedText,
        },
      });
      expect(res.config.method).toEqual("post");
      expect(res.config.url).toEqual("/posts/1");
    });
  });
});
