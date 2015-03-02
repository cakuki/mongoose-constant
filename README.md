# Mongoose Constant

A simple plugin to make marked paths constant.



## Usage

### Installation

```

    npm install --save mongoose-constant

```

### Marking constant

Add `constant: true` option for paths you want to be set only on first time you save that document.

**Example**

```javascript

    var FooSchema = new Schema({
        name: { type: String, constant: true }
    });
    FooSchema.plugin(constantPlugin);

    var Foo = mongoose.model('Foo', FooSchema);

    var bar = new Foo({
        name: 'test1'
    });

    bar.save(function(err, bar) {
        bar.name = 'test2';
        bar.save(function(err, bar) {
            // It will not be saved
        });
    });

```



## Note that

As this plugin works via mongoose middleware it will not work on direct db operations. (This is how mongoose works. See [explanation](https://github.com/LearnBoost/mongoose/issues/964).)

In short, you should avoid using:

  * update
  * findByIdAndUpdate
  * findOneAndUpdate
  * findOneAndRemove
  * findByIdAndRemove

methods of your documents and models if you want Mongoose validations/middlewares (as this plugin) to work.



## Release History

  * **0.1.0** *02/03/2015* Initial release



## License

[ISC License](http://opensource.org/licenses/ISC)
