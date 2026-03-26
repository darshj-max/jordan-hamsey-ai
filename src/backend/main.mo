import Time "mo:core/Time";
import Map "mo:core/Map";
import Array "mo:core/Array";
import Text "mo:core/Text";
import Order "mo:core/Order";
import Runtime "mo:core/Runtime";
import List "mo:core/List";
import Iter "mo:core/Iter";

actor {
  type Achievement = {
    id : Text;
    name : Text;
    unlocked : Bool;
    unlockedTimestamp : Time.Time;
  };

  module Achievement {
    public func compare(achievement1 : Achievement, achievement2 : Achievement) : Order.Order {
      Text.compare(achievement1.id, achievement2.id);
    };
  };

  type Recipe = {
    id : Text;
    title : Text;
    description : Text;
    cookTime : Nat; // minutes
    difficulty : Text; // "Easy", "Medium", "Hard"
    cuisineType : Text;
    nutritionInfo : Text; // JSON string
    ingredients : [Text];
    steps : [Text];
  };

  module Recipe {
    public func compare(recipe1 : Recipe, recipe2 : Recipe) : Order.Order {
      Text.compare(recipe1.title, recipe2.title);
    };
  };

  type MealPlan = {
    weekStartDate : Text;
    planData : Text; // JSON string
  };

  // Per session (anon) data
  type SessionData = {
    var recipes : List.List<Recipe>;
    achievements : Map.Map<Text, Achievement>;
    var mealPlan : ?MealPlan;
  };

  // Compare session data by recipes count for sorting (example custom comparison)
  module SessionData {
    public func compareByRecipesCount(session1 : SessionData, session2 : SessionData) : Order.Order {
      Nat.compare(session1.recipes.size(), session2.recipes.size());
    };
  };

  type SessionDataView = {
    recipes : [Recipe];
    achievements : [Achievement];
    mealPlan : ?MealPlan;
  };

  // Compare session data by recipes count for sorting (example custom comparison)
  module SessionDataView {
    public func compareByRecipesCount(session1 : SessionDataView, session2 : SessionDataView) : Order.Order {
      Nat.compare(session1.recipes.size(), session2.recipes.size());
    };
  };

  func view(sessionData : SessionData) : SessionDataView {
    {
      recipes = sessionData.recipes.toArray();
      achievements = sessionData.achievements.values().toArray().sort();
      mealPlan = sessionData.mealPlan;
    };
  };

  let sessions = Map.empty<Text, SessionData>();

  // Main data access methods

  public shared ({ caller }) func getOrCreateSession(sessionId : Text) : async () {
    if (not sessions.containsKey(sessionId)) {
      let newSession : SessionData = {
        var recipes = List.empty<Recipe>();
        achievements = Map.empty<Text, Achievement>();
        var mealPlan = null;
      };
      sessions.add(sessionId, newSession);
    };
  };

  public query ({ caller }) func getSessionData(sessionId : Text) : async ?SessionDataView {
    sessions.get(sessionId).map(view);
  };

  public shared ({ caller }) func saveRecipe(sessionId : Text, recipe : Recipe) : async () {
    await getOrCreateSession(sessionId);
    let session = switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Cannot retrieve session that was just created. ") };
      case (?session) { session };
    };

    let existingRecipeIndex = session.recipes.findIndex(
      func(r) { r.id == recipe.id }
    );

    switch (existingRecipeIndex) {
      case (null) {
        // Recipe not found, add new
        session.recipes.add(recipe);
      };
      case (?index) {
        // Replace existing recipe
        session.recipes.put(index, recipe);
      };
    };
  };

  public shared ({ caller }) func removeRecipe(sessionId : Text, recipeId : Text) : async () {
    switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Session not found") };
      case (?session) {
        let filtered = session.recipes.filter(
          func(r) { r.id != recipeId }
        );
        session.recipes := filtered;
      };
    };
  };

  public query ({ caller }) func getSavedRecipes(sessionId : Text) : async [Recipe] {
    switch (sessions.get(sessionId)) {
      case (null) { [] };
      case (?session) { session.recipes.toArray() };
    };
  };

  public shared ({ caller }) func saveAchievement(sessionId : Text, achievement : Achievement) : async () {
    await getOrCreateSession(sessionId);
    let session = switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Cannot retrieve session that was just created. ") };
      case (?session) { session };
    };
    session.achievements.add(achievement.id, achievement);
  };

  public query ({ caller }) func getAchievements(sessionId : Text) : async [Achievement] {
    switch (sessions.get(sessionId)) {
      case (null) { [] };
      case (?session) { session.achievements.values().toArray().sort() };
    };
  };

  public shared ({ caller }) func saveMealPlan(sessionId : Text, mealPlan : MealPlan) : async () {
    await getOrCreateSession(sessionId);
    let session = switch (sessions.get(sessionId)) {
      case (null) { Runtime.trap("Cannot retrieve session that was just created. ") };
      case (?session) { session };
    };
    session.mealPlan := ?mealPlan;
  };

  public query ({ caller }) func getMealPlan(sessionId : Text) : async ?MealPlan {
    switch (sessions.get(sessionId)) {
      case (null) { null };
      case (?session) { session.mealPlan };
    };
  };
};
