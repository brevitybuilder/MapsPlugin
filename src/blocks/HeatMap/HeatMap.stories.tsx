import type { Meta, StoryObj } from "@storybook/react";
import { HeatMap } from ".";

const meta: Meta<typeof HeatMap> = {
	title: "Example/Heatmap",
	component: HeatMap,
};

type Story = StoryObj<typeof HeatMap>;

export const Primary: Story = {
	render: (props) => (
		<HeatMap apiKey={"AIzaSyD-Yp-WAQ2u_b0Zj-26YjoPgl8t3-to4qE"} />
	),
};

export default meta;
