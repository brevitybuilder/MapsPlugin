import { useGetKey, useGetSet } from "@brevity-builder/react";
import {
	GoogleMap,
	HeatmapLayer,
	type Libraries,
	Marker,
	MarkerClusterer,
	useJsApiLoader,
} from "@react-google-maps/api";
import React from "react";

const defaultMapContainerStyle = {
	width: "100%",
	height: "100%",
	minHeight: "200px",
};

const defaultCenter = {
	lat: 41.5896,
	lng: -93.616,
};

interface MarkerData {
	lat: number;
	lng: number;
	id: string;
}

interface MapProps {
	apiKey: string;
	markers: Array<MarkerData>;
	className: string;
	onMarkerClick?: (marker: MarkerData) => void;
}

interface Boundaries {
	latMin: number;
	latMax: number;
	lngMin: number;
	lngMax: number;
}

// We don't need libraries for basic markers and clustering
const libraries = ["visualization"] as Libraries;

// Default options for the marker clusterer
const ZOOM_THRESHOLD = 12;
export const MapComponent = ({
	apiKey,
	markers = [],
	className,
	onMarkerClick,
	...rest
}: MapProps) => {
	const key = useGetKey(rest);
	const [zoom, setZoom] = React.useState(10);
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
			const zoom = map.getZoom() || 10;
			console.log(zoom);
			setZoom(zoom);
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

	const handleMarkerClick = (marker: MarkerData) => {
		if (onMarkerClick) {
			onMarkerClick(marker);
		}
	};

	return isLoaded ? (
		<GoogleMap
			mapContainerClassName={className}
			mapContainerStyle={defaultMapContainerStyle}
			center={defaultCenter}
			zoom={10}
			onLoad={onLoad}
			onUnmount={() => setMap(null)}
			onBoundsChanged={onBoundsChanged}
		>
			{markers.length <= 500 ? (
				<MarkerClusterer>
					{(clusterer) => (
						<>
							{markers.map((marker) => (
								<Marker
									key={marker.id}
									position={{ lat: marker.lat, lng: marker.lng }}
									clusterer={clusterer}
									onClick={() => handleMarkerClick(marker)}
								/>
							))}
						</>
					)}
				</MarkerClusterer>
			) : (
				<HeatmapLayer
					data={markers.map((c) => new window.google.maps.LatLng(c.lat, c.lng))}
					options={{ radius: 20 }}
				/>
			)}
		</GoogleMap>
	) : (
		<></>
	);
};
