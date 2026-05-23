declare namespace $aniquiz {
	type Type =
		| "titleBasedOnSynopsis"
		| "titleBasedOnCharacter"
		| "titleBasedOnCoverimage"
		| "characterBasedOnTitle"
		| "characterNotOnGivenTitle"
		| "characterBasedOnDesc"
		| "characterBasedOnImage"
		| "charactersNativeSeiyuu"
		| "studioBasedOnTitle"
		| "titleBasedOnStudio"
		| "titleNotOnGivenStudio"
		| "completeTheTitle"
		| "reshuffleTheTitle"
		| "releaseYear"
		| "releaseYearSeason"
		| "totalProgress"
		| "genreIn"
		| "genreNotIn"
		| "format";

	type genre =
		| "Action"
		| "Adventure"
		| "Comedy"
		| "Drama"
		| "Ecchi"
		| "Fantasy"
		| "Horror"
		| "Mahou Shoujo"
		| "Mecha"
		| "Music"
		| "Mystery"
		| "Psychological"
		| "Romance"
		| "Sci-Fi"
		| "Slice of Life"
		| "Sports"
		| "Supernatural"
		| "Thriller";

	type State =
		| {
				active: boolean;
				type: "Casual";
				quiz: CasualModeQuizObject | null;
		  }
		| {
				active: boolean;
				type: "Time Attack";
				quiz: TimeAttackModeQuizObject | null;
		  }
		| {
				active: boolean;
				type: "Time Crunch";
				quiz: TimeCrunchModeQuizObject | null;
		  };

	interface Profile {
		name: string | null;
		isVerified: boolean;
		scores: {
			casual: number[];
			timeattack: number[];
			timecrunch: number[];
		};
		hiscores: {
			casual: number[];
			timeattack: number[];
			timecrunch: number[];
		};
	}

	interface VerifiedProfile extends Profile {
		name: string;
		isVerified: true;
	}

	interface BaseQuizObject {
		heading: string;
		question: string;
		subtext?: string;
		imgUrl?: string;
		choices: string[];
		answer: string;
	}

	interface CasualModeQuizObject extends BaseQuizObject {
		type: "casual";
	}

	interface TimeAttackModeQuizObject extends BaseQuizObject {
		type: "time-attack";
		totalAllowableTime: number; // calculated via length of string (longer questions need longer time, min 10s)
	}

	interface TimeCrunchModeQuizObject extends BaseQuizObject {
		type: "time-crunch";
	}

	interface BaseScoreTracker {
		score: number;
		hiscore: number; // $store
	}

	// 1 correct answer = 10 points
	interface CasualModeScoreTracker extends BaseScoreTracker {
		type: "casual";
	}

	// correct answer = Math.round(consumedTime*baseTotalTime/totalAllowableTime)
	interface TimeAttackModeScoreTracker extends BaseScoreTracker {
		type: "time-attack";
		baseTotalTime: 10;
	}

	interface TimeCrunchModeScoreTracker extends BaseScoreTracker {
		type: "time-crunch";
		totalTime: 120;
	}
}
