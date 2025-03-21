import { useGetKey, useGetSet } from "@brevity-builder/react";
import {
	GoogleMap,
	HeatmapLayer,
	type Libraries,
	useJsApiLoader,
} from "@react-google-maps/api";
import React from "react";

const mapContainerStyle = {
	width: "100%",
	height: "500px",
};

const center = {
	lat: 41.5896,
	lng: -93.616,
};

interface HeatMapProps {
	apiKey: string;
	markers: Array<{ lat: number; lng: number; id: string }>;
	className: string;
}

interface Boundaries {
	latMin: number;
	latMax: number;
	lngMin: number;
	lngMax: number;
}

const libraries = ["visualization"] as Libraries;
export const HeatMap = ({
	apiKey,
	markers = [],
	className,
	...rest
}: HeatMapProps) => {
	const key = useGetKey(rest);
	const [{ box }, setState] = useGetSet<{ box: Boundaries }>(key, {
		box: {},
	});
	const [map, setMap] = React.useState<google.maps.Map | null>(null);
	const { isLoaded } = useJsApiLoader({
		id: "google-map-script",
		googleMapsApiKey: apiKey,
		libraries: libraries,
	});

	const onLoad = React.useCallback((map: google.maps.Map) => {
		setMap(map);
	}, []);

	const onBoundsChanged = React.useCallback(() => {
		if (map) {
			const bounds = map.getBounds();
			if (bounds) {
				const ne = bounds.getNorthEast();
				const sw = bounds.getSouthWest();

				setState({
					box: {
						latMin: sw.lat(),
						latMax: ne.lat(),
						lngMin: sw.lng(),
						lngMax: ne.lng(),
					},
				});
			}
		}
	}, [map, setState]);

	return isLoaded ? (
		<GoogleMap
			mapContainerClassName={className}
			mapContainerStyle={mapContainerStyle}
			center={center}
			zoom={10}
			onLoad={onLoad}
			onUnmount={() => setMap(null)}
			onBoundsChanged={onBoundsChanged}
		>
			{/* Child components, such as markers, info windows, etc. */}
			<HeatmapLayer
				data={markers.map((c) => new window.google.maps.LatLng(c.lat, c.lng))}
				options={{ radius: 20 }}
			/>
		</GoogleMap>
	) : (
		<></>
	);
};
