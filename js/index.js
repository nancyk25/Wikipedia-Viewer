"use strict";

function _classCallCheck(instance, Constructor) { if (!(instance instanceof Constructor)) { throw new TypeError("Cannot call a class as a function"); } }

function _possibleConstructorReturn(self, call) { if (!self) { throw new ReferenceError("this hasn't been initialised - super() hasn't been called"); } return call && (typeof call === "object" || typeof call === "function") ? call : self; }

function _inherits(subClass, superClass) { if (typeof superClass !== "function" && superClass !== null) { throw new TypeError("Super expression must either be null or a function, not " + typeof superClass); } subClass.prototype = Object.create(superClass && superClass.prototype, { constructor: { value: subClass, enumerable: false, writable: true, configurable: true } }); if (superClass) Object.setPrototypeOf ? Object.setPrototypeOf(subClass, superClass) : subClass.__proto__ = superClass; }

/* Presentational components */
var Greeting = function Greeting(props) {
  return(
    /*Hello {props.name}{props.punc}*/
    React.createElement(
      "h2",
      null,
      "What would you like to learn?"
    )
  );
};

var Randomizer = function Randomizer(props) {
  return React.createElement(
    "div",
    null,
    React.createElement(
      "svg",
      { xmlns: "http://www.w3.org/2000/svg", version: "1.1", className: "goo" },
      React.createElement(
        "defs",
        null,
        React.createElement(
          "filter",
          { id: "goo" },
          React.createElement("feGaussianBlur", { "in": "SourceGraphic", stdDeviation: "10", result: "blur" }),
          React.createElement("feColorMatrix", { "in": "blur", mode: "matrix", values: "1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 19 -9", result: "goo" }),
          React.createElement("feComposite", { "in": "SourceGraphic", in2: "goo" })
        )
      )
    ),
    React.createElement(
      "span",
      { className: "button--bubble__container" },
      React.createElement(
        "a",
        { href: "http://en.wikipedia.org/wiki/Special:Random", className: "button button--bubble", target: "_blank" },
        "SURPRISE ME"
      ),
      React.createElement(
        "span",
        { className: "button--bubble__effect-container" },
        React.createElement("span", { className: "circle top-left" }),
        React.createElement("span", { className: "circle top-left" }),
        React.createElement("span", { className: "circle top-left" }),
        React.createElement("span", { className: "button effect-button" }),
        React.createElement("span", { className: "circle bottom-right" }),
        React.createElement("span", { className: "circle bottom-right" }),
        React.createElement("span", { className: "circle bottom-right" })
      )
    )
  );
};

/* State components */

var SearchBar = function (_React$Component) {
  _inherits(SearchBar, _React$Component);

  /*Callback for SearchBar props to update Wiki - keeping track of what we're searching*/

  function SearchBar() {
    _classCallCheck(this, SearchBar);

    var _this = _possibleConstructorReturn(this, _React$Component.call(this));

    _this.state = {
      searchText: ''
    };
    return _this;
  }
  /*This is setting the value of searchText as it's getting inputted*/

  SearchBar.prototype.handleInputChange = function handleInputChange(event) {
    this.setState({
      searchText: event.target.value
    });
  };

  //Grab the value and call the function we pass down from Wikipedia viewer

  SearchBar.prototype.handleSubmit = function handleSubmit(event) {
    event.preventDefault();
    var searchText = this.state.searchText.trim(); //Remove whitespace in text
    if (!searchText) {
      //if no search term is typed return early and do nothing
      return;
    }
    console.log(searchText);
    this.props.onSearch(searchText); //Execute call back here
    this.setState({ searchText: '' }); //Reset the box after search - optional
  };

  SearchBar.prototype.render = function render() {
    return React.createElement(
      "form",
      { className: "search", onSubmit: this.handleSubmit.bind(this) },
      React.createElement(
        "a",
        { href: "#", className: "search-button" },
        React.createElement("i", { className: "fa fa-search" })
      ),
      React.createElement("input", {
        type: "search",
        placeholder: "Search and hit enter!",
        onChange: this.handleInputChange.bind(this),
        value: this.state.searchText })
    );
  };

  return SearchBar;
}(React.Component);

/*Single Result*/

function Result(props) {
  return React.createElement(
    "a",
    { href: props.url, className: "result", target: "_blank", rel: "noopener noreferrer" },
    React.createElement(
      "div",
      null,
      React.createElement(
        "h2",
        null,
        props.title
      ),
      React.createElement(
        "p",
        null,
        props.description
      )
    )
  );
}

/*Result list component*/
//results-1 returns search titles
//results-2 returns captions
//results-3 returns URLs

var ResultList = function (_React$Component2) {
  _inherits(ResultList, _React$Component2);

  function ResultList() {
    _classCallCheck(this, ResultList);

    return _possibleConstructorReturn(this, _React$Component2.apply(this, arguments));
  }

  ResultList.prototype.render = function render() {
    var _this3 = this;

    //create a variable to map and parse results
    var results = this.props.results[1].map(function (result, index) {
      return(
        //adding a unique key to each result - send props to single Result component to render
        React.createElement(Result, {
          key: index,
          title: _this3.props.results[1][index],
          description: _this3.props.results[2][index],
          url: _this3.props.results[3][index]
        })
      );
    });
    return React.createElement(
      "div",
      { className: "results" },
      results
    );
  };

  return ResultList;
}(React.Component);

/*Container component*/

var WikipediaViewer = function (_React$Component3) {
  _inherits(WikipediaViewer, _React$Component3);

  function WikipediaViewer() {
    _classCallCheck(this, WikipediaViewer);

    var _this4 = _possibleConstructorReturn(this, _React$Component3.call(this));

    _this4.state = {
      searchText: '',
      isRandom: false,
      //initialize state of results here
      results: ['', [], [], []]
    };

    _this4.handleSearchInput = _this4.handleSearchInput.bind(_this4);
    _this4.handleRandomInput = _this4.handleRandomInput.bind(_this4);

    return _this4;
  }

  //Callback function from Search Bar component which sets state of search text

  WikipediaViewer.prototype.handleSearchInput = function handleSearchInput(searchText) {
    var _this5 = this;

    //Place Wiki API here - using superAgent
    superagent.get('https://en.wikipedia.org/w/api.php').query({
      search: searchText, // The search keyword passed by SearchBar
      action: 'opensearch', //you can use the any search here provided?
      format: 'json' // We want JSON back
    }).use(jsonp) //use the json plugin
    .end(function (error, response) {
      if (error) {
        console.log(error);
      } else {
        //set the state once results are back to send us props to ResultList component
        _this5.setState({ results: response.body });
      }
    });
  };

  WikipediaViewer.prototype.handleRandomInput = function handleRandomInput(isRandom) {
    this.setState({
      isRandom: isRandom
    });
  };

  WikipediaViewer.prototype.render = function render() {
    return React.createElement(
      "div",
      null,
      React.createElement(Greeting, null),
      React.createElement(SearchBar, {
        onSearch: this.handleSearchInput.bind(this),
        isRandom: this.state.isRandom,
        handleSearchInput: this.handleSearchInput,
        handleRandomInput: this.handleRandomInput
      }),
      React.createElement(Randomizer, null),
      React.createElement(ResultList, { results: this.state.results })
    );
  };

  return WikipediaViewer;
}(React.Component);

// ========================================

ReactDOM.render(React.createElement(WikipediaViewer, null), document.getElementById('root'));

// ========================================

/*--Animations for Bubble Button--*/
$('.button--bubble').each(function () {
  var $circlesTopLeft = $(this).parent().find('.circle.top-left');
  var $circlesBottomRight = $(this).parent().find('.circle.bottom-right');

  var tl = new TimelineLite();
  var tl2 = new TimelineLite();

  var btTl = new TimelineLite({ paused: true });

  tl.to($circlesTopLeft, 1.2, { x: -25, y: -25, scaleY: 2, ease: SlowMo.ease.config(0.1, 0.7, false) });
  tl.to($circlesTopLeft.eq(0), 0.1, { scale: 0.2, x: '+=6', y: '-=2' });
  tl.to($circlesTopLeft.eq(1), 0.1, { scaleX: 1, scaleY: 0.8, x: '-=10', y: '-=7' }, '-=0.1');
  tl.to($circlesTopLeft.eq(2), 0.1, { scale: 0.2, x: '-=15', y: '+=6' }, '-=0.1');
  tl.to($circlesTopLeft.eq(0), 1, { scale: 0, x: '-=5', y: '-=15', opacity: 0 });
  tl.to($circlesTopLeft.eq(1), 1, { scaleX: 0.4, scaleY: 0.4, x: '-=10', y: '-=10', opacity: 0 }, '-=1');
  tl.to($circlesTopLeft.eq(2), 1, { scale: 0, x: '-=15', y: '+=5', opacity: 0 }, '-=1');

  var tlBt1 = new TimelineLite();
  var tlBt2 = new TimelineLite();

  tlBt1.set($circlesTopLeft, { x: 0, y: 0, rotation: -45 });
  tlBt1.add(tl);

  tl2.set($circlesBottomRight, { x: 0, y: 0 });
  tl2.to($circlesBottomRight, 1.1, { x: 30, y: 30, ease: SlowMo.ease.config(0.1, 0.7, false) });
  tl2.to($circlesBottomRight.eq(0), 0.1, { scale: 0.2, x: '-=6', y: '+=3' });
  tl2.to($circlesBottomRight.eq(1), 0.1, { scale: 0.8, x: '+=7', y: '+=3' }, '-=0.1');
  tl2.to($circlesBottomRight.eq(2), 0.1, { scale: 0.2, x: '+=15', y: '-=6' }, '-=0.2');
  tl2.to($circlesBottomRight.eq(0), 1, { scale: 0, x: '+=5', y: '+=15', opacity: 0 });
  tl2.to($circlesBottomRight.eq(1), 1, { scale: 0.4, x: '+=7', y: '+=7', opacity: 0 }, '-=1');
  tl2.to($circlesBottomRight.eq(2), 1, { scale: 0, x: '+=15', y: '-=5', opacity: 0 }, '-=1');

  tlBt2.set($circlesBottomRight, { x: 0, y: 0, rotation: 45 });
  tlBt2.add(tl2);

  btTl.add(tlBt1);
  btTl.to($(this).parent().find('.button.effect-button'), 0.8, { scaleY: 1.1 }, 0.1);
  btTl.add(tlBt2, 0.2);
  btTl.to($(this).parent().find('.button.effect-button'), 1.8, { scale: 1, ease: Elastic.easeOut.config(1.2, 0.4) }, 1.2);

  btTl.timeScale(2.6);

  $(this).on('mouseover', function () {
    btTl.restart();
  });
});