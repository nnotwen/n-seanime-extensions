/// <reference path="../../typings/plugin.d.ts" />

declare namespace $score {
	interface FieldItem {
		label: string;
		weight: number;
	}

	interface FieldEntry extends FieldItem {
		score: number;
	}
}
