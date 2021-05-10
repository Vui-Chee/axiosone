describe("axiosone -", function () {
  var axiosone = require("../.");

  it("axiosone has bindConfig method", function () {
    expect(axiosone.bindConfig).not.toBe(undefined);
    expect(toString.call(axiosone.bindConfig)).toEqual("[object Function]");
  });

  it("axiosone can bind config", function () {
    var url = "http://localhost:3000/posts";
    axiosone.bindConfig({
      testQuery: {
        config: {
          method: "GET",
          url: url,
        },
      },
    });

    expect(axiosone.testQuery).not.toBe(undefined);
    expect(toString.call(axiosone.testQuery)).toEqual("[object Function]");

    // Test if configuration is correct
    return axiosone.testQuery().then(function (result) {
      expect(result.status).toBe(200);
      expect(result.config.url).toBe(url);
      expect(result.config.method).toBe("get");
    });
  });
});
