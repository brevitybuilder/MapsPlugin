import type { Meta, StoryObj } from "@storybook/react";
import { MapComponent } from ".";

const meta: Meta<typeof MapComponent> = {
	title: "Example/Map",
	component: MapComponent,
};

type Story = StoryObj<typeof MapComponent>;

export const Primary: Story = {
	render: (props) => (
		<MapComponent
			className=""
			apiKey={"AIzaSyD-Yp-WAQ2u_b0Zj-26YjoPgl8t3-to4qE"}
			markers={[
				{ id: "marker1", lat: 41.56, lng: -93.324 },
				{ id: "marker2", lat: 41.58, lng: -93.35 },
				{ id: "marker3", lat: 41.53, lng: -93.31 },
				{ id: "marker4", lat: 41.59, lng: -93.29 },
				{ id: "marker5", lat: 41.55, lng: -93.36 },
				{ id: "marker6", lat: 41.52, lng: -93.33 },
				{ id: "marker7", lat: 41.57, lng: -93.28 },
				{ id: "marker8", lat: 41.54, lng: -93.34 },
				{ id: "marker9", lat: 41.61, lng: -93.32 },
				{ id: "marker10", lat: 41.58, lng: -93.3 },
			]}
		/>
	),
};

export default meta;
