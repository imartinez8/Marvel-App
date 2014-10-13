//~<*{{ User Collection}}*>~ --------------------------------
// 
// 

var User_Model = Backbone.Model.extend({
	initialize: function(){
		console.log("New user initialised!");
	},
	urlRoot: '/users'
});

var User_Collection  = Backbone.Collection.extend({	
	model: User_Model, // do we need to do an addOne-like thing?
	url: '/users'
});

var user_collection = new User_Collection();

// var user_list_view = new List_View( {collection: user_collection} );
//this might be used for if there is a select for which user profile we're on or logged in





// ~<*{{ Comic Views}}*>~ --------------------------------
// 
// 

var ComicModel = Backbone.Model.extend({
	initialize: function(){
		console.log("New comic initialised!");
	},
	urlRoot: '/comics'
});

var UserComicModel = Backbone.Model.extend({
	initialize: function(){
		console.log("New comic initialised!");
	},
	urlRoot: '/user_comics'
});

var ComicCollection = Backbone.Model.extend({
	model: ComicModel,
	url: '/comics'
});

var UserComicCollection = Backbone.Model.extend({
	model: UserComicModel,
	url: '/user_comics'
});

var comicCollection = new ComicCollection();
var userComicCollection = new UserComicCollection();

var ComicView = Backbone.View.extend({
	comicTemplate: _.template( $('#comic-template').html() ),
	events: {
		"click someElement" : "seeInfo"
	},

	seeInfo: function() {
		var modal = new InfoModalView({ model: this.model });
	},

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render:function(){
		var thisView = this;
		var comicId = (this.model.attributes.comic_id);

		comicCollection.fetch().done(function() {
			var comic = comicCollection.where({id: comicId})[0].attributes;

			thisView.$el.html('<img src="' + comic.thumbnail + '"class="comic-image"><li class="character-info"><h4>' + comic.title + '</h4></br>' + comic.date_issued + '</br>' + comic.description + '</li>')
			// thisView.$el.html(thisView.favCharTemplate({ character: character }));
		})
		
	}
});

var ComicListView = Backbone.View.extend({

	initialize: function(option){
		this.userId = option.userId
		this.listenTo(this.collection, 'add', this.addOne);
		this.collection.fetch();
	},

	addOne:function(item){
		if (item.attributes.user_id == this.userId) {
		   var favCharacter = new CharacterView({ model: item })
		   favCharacter.render();
		   this.$el.append(favCharacter.el)
		}
	}
});

$('#add').on('click', function(){
	var searchedName = $(".fav_characters_input").val(); //input value

	var searchResult = characterCollection.where({name: searchedName});

	if (searchResult.length != 0) {
		console.log(searchResult[0].id)
		favCharacter_collection.create({user_id: 5, character_id: searchResult[0].id});
	} else {
		console.log("Not Here")
		character_collection.create({name: searchedName})
		setTimeout(function() {

			var charId = character_collection.where({name: searchedName})[0].id
			favCharacter_collection.create({user_id: 5, character_id: charId});	
		}, 4000);
	}
});


// var readComics = new ComicListView({ collection: userComicCollection, el: $('#fav-characters-list'), userId: 5 })
// 
// 
// NO COMIC_LIST_VIEW because we aren't showing all comics in database
// this is all comics not just the user's







//~<*{{ Character Collection}}*>~ --------------------------------
// 
// 

var Character_Model = Backbone.Model.extend({
	initialize: function(){
		console.log("New character initialised!");
	},
	urlRoot: '/characters'
});

var Character_Collection = Backbone.Collection.extend({
	model: Character_Model,
	url: '/characters'
});

var character_collection = new Character_Collection();
// NO CHARCTER_LIST_VIEW because the user will be searching through this collection
// NO CHARACTER_LIST_VIEW because we're not showing all the characters in the db.




//~<*{{ Badge Views}}*>~ --------------------------------
// 
// 
var UsersBadge_Model = Backbone.Model.extend({
	initialize: function(){
		console.log("New Badge initialised!");
	},

	urlRoot: '/user_badges'
});

var Badge_Model = Backbone.Model.extend({
	initialize: function(){
		console.log("New Badge initialised!");
	},

	urlRoot: '/badges'
});

var UsersBadge_Collection = Backbone.Collection.extend({
	model: UsersBadge_Model,
	url: '/user_badges'
});

var Badge_Collection = Backbone.Collection.extend({
	model: Badge_Model,
	url: '/badges'
});

var usersBadge_collection = new UsersBadge_Collection();
usersBadge_collection.fetch();

var badge_collection = new Badge_Collection();
badge_collection.fetch();

var BadgeView = Backbone.View.extend({
	className: 'badge',
	initialize: function(){
		this.listenTo(this.model, 'remove', this.remove);
	},
	render: function(){
		console.log(this.model.attributes)
		var thisView = this;
		var badgeId = (this.model.attributes.badge_id);

		badge_collection.fetch().done(function() {
			var badge = badge_collection.where({id: badgeId})[0].attributes;

			thisView.$el.html('<img src="#"class="badge-image"><h4>' + badge.name + '</h4>');
		});
	}
});

var BadgeListView = Backbone.View.extend({
	tagName: 'section',
	className: 'badge-list',
	initialize: function(option){
		this.userId = option.userId;
		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'change', this.render);
		this.collection.fetch();
	},
	addOne: function(item){
		var badgeView = new BadgeView({ model: item});
		badgeView.render();
		this.$el.append(badgeView.el);
	}
});

var usersBadges = new BadgeListView({ collection: usersBadge_collection, el: $('#badges'), userId: 5});




var Item_View = Backbone.View.extend({
	tagName: "li",

	initialize: function(){
		this.listenTo(this.model, "remove", this.remove);
	},
	render: function(){
		this.$el.html("<p>" + this.model.get('name') + "</p>");
	}

});

var List_View = Backbone.View.extend({
	tagName: "ul",

	initialize: function(){
		this.listenTo(this.collection, 'add', this.addOne);
		this.listenTo(this.collection, 'change', this.render); // is this right?
		// when colleciton changes, reRender list_view ?
		this.collection.fetch();
	},

	addOne: function(item_view){
		var item_view = new Item_view({model: item_view});
		item_view.render();
		this.$el.append(item_view);
	},
	render: function(){
		this.collection.forEach(this.addOne, this);
	}
});


//~<*{{ FavCharacters Views}}*>~ --------------------------------
// 
// 


var FavCharacter_Model = Backbone.Model.extend({
	initialize: function(){
	},
	urlRoot: '/fav_characters'
});

var FavCharacter_Collection = Backbone.Collection.extend({
	model: FavCharacter_Model,
	url: '/fav_characters'
});
var favCharacter_collection = new FavCharacter_Collection();


var CharacterView = Backbone.View.extend({
	favCharTemplate: _.template( $('#fav-char-template').html() ),
	className: 'fav-char-el',
	events: {
		"click someElement" : "seeInfo"
	},

	seeInfo: function() {
		var modal = new InfoModalView({ model: this.model });
	},

	initialize: function(){
		this.listenTo(this.model, 'change', this.render);
		this.listenTo(this.model, 'destroy', this.remove);
	},

	render:function(){
		var thisView = this;
		var characterId = (this.model.attributes.character_id);

		character_collection.fetch().done(function() {
			var character = character_collection.where({id: characterId})[0].attributes;

			thisView.$el.html('<img src="' + character.image_url + '"class="fav-char-image"><li class="character-info"><h4>' + character.name + '</h4></br>' + character.description + '</li>')
			// thisView.$el.html(thisView.favCharTemplate({ character: character }));
		})
		
	}
});

var FavCharacterListView = Backbone.View.extend({

	initialize: function(option){
		this.userId = option.userId
		this.listenTo(this.collection, 'add', this.addOne);
		this.collection.fetch();
	},

	addOne:function(item){
		if (item.attributes.user_id == this.userId) {
		   var favCharacter = new CharacterView({ model: item })
		   favCharacter.render();
		   this.$el.append(favCharacter.el)
		}
	}
});

$('#add').on('click', function(){
	var searchedName = $(".fav_characters_input").val(); //input value

	var searchResult = character_collection.where({name: searchedName});

	if (searchResult.length != 0) {
		console.log(searchResult[0].id)
		favCharacter_collection.create({user_id: 5, character_id: searchResult[0].id});
	} else {
		console.log("Not Here")
		character_collection.create({name: searchedName})
		setTimeout(function() {

			var charId = character_collection.where({name: searchedName})[0].id
			favCharacter_collection.create({user_id: 5, character_id: charId});	
		}, 4000);
	}
});


var favCharacters = new FavCharacterListView({ collection: favCharacter_collection, el: $('#fav-characters-list'), userId: 5 })

var FormView = Backbone.View.extend({

	events: {
		"click button#add" : "addFavCharacter"
	},

	addFavCharacter: function() {
		console.log("here")
		var searchedName = this.el.val(); //input value
		var searchResult = character_collection.where({name: searchedName});

		if (searchResult.length != 0) {
			console.log(this.collection)
			this.collection.create({user_id: this.userId, character_id: searchResult.id});
		} else {
			console.log("Not Here")
			character_collection.create({name: searchedName});
		}

	}
});





















