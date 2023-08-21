const User = require("../../models/User.model.js");
const chai = require("chai");
const chaiHttp = require("chai-http");
const app = require("../index");

chai.should();
chai.use(chaiHttp);

  describe("/GET users", () => {
    it("should get all users", (done) => {
      let user = new User();
        user.save().then((user, err) => {
          chai
            .request(app)
            .get("/")
            .end((err, res) => {
              res.should.have.status(200);
              res.body.data.should.be.a("array");
              done();
            });
        });
    });
  });

  describe("/POST user", () => {
    it("should POST a user", (done) => {
      chai
        .request(app)
        .post("/user")
        .send({})
        .end((err, res) => {
          res.should.have.status(200);
          res.body.data.should.be.a("object");
          done();
        });
    });
  });

  describe("/GET/user/:id user", () => {
    it("should GET a user by the id", (done) => {
      let user = new User();
      user.save().then((user, err) => {
        chai
          .request(app)
          .get("/user/" + user._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.a("object");
            done();
          });
      });
    });
  });

  describe("/GET/user/:id user", () => {
    it("should fail to GET a user by the id", (done) => {
        chai
          .request(app)
          .get("/user/")
          .end((err, res) => {
            res.should.have.status(404);
            done();
          });
    });
  });

  describe("/PATCH/user/:id user", () => {
    it("should UPDATE a user", (done) => {
      let user = new User({
          data:{name:"User"}
      });
      user.save().then((user, err) => {
        chai
          .request(app)
          .patch("/user/" + user._id)
          .send({
              data: { name: "new name" },
          })
          .end((err, res) => {
            res.should.have.status(200);
            res.body.data.should.be.a("object");
            done();
          });
      });
    });
  });

  describe("/DELETE/user/:id user", () => {
    it("should DELETE a user", (done) => {
      let user = new User();
      user.save().then((user, err) => {
        chai
          .request(app)
          .delete("/user/" + user._id)
          .end((err, res) => {
            res.should.have.status(200);
            res.body.should.be.a("object");
            done();
          });
      });
    });
    it("should NOT DELETE a user", (done) => {
      let user = new User();
      user.save().then((user, err) => {
        chai
          .request(app)
          .delete("/user/")
          .end((err, res) => {
            res.should.have.status(500);
            done();
          });
      });
    });
  });