'use client';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl, {Map} from 'mapbox-gl';
import {useEffect, useRef, useState} from 'react';
import {
	addSitiosDeApoyoLayer,
	addSitiosDeApoyoSource,
	removeSitiosDeApoyoLayer,
} from '@/lib/sitios-de-apoyo.ts';
import {
	addFeminicidiosFiscaliaLayer,
	addFeminiciosFiscaliaSource,
	removeFeminicidiosFiscaliaLayer,
} from '@/lib/feminicidios-fiscalia.ts';
import {
	addFeminicidiosPeriodicosLayer,
	addFeminicidiosPeriodicosSource,
	removeFeminicidiosPeriodicosLayer,
} from '@/lib/feminicidios-periodicos.ts';
import {
	addAreaSinCubrimientoDeSitioLayer,
	addAreaSinCubrimientoDeSitioSource,
	removeAreaSinCubrimientoDeSitioLayer,
} from '@/lib/area-sin-cubrimiento-de-sitio.ts';
import {
	addResagoSocialLayer,
	addResagoSocialSource,
	removeResagoSocialLayer,
} from '@/lib/resago-social.ts';

mapboxgl.accessToken = process.env.NEXT_PUBLIC_MAPBOX_TOKEN!;

export type MainMapProps = {
	readonly className?: string;
	readonly showFiscalia: boolean;
	readonly showCubrimientoDeSitio: boolean;
	readonly showRezagoSocial : boolean;
	readonly showSitiosDeApoyo : boolean;
};

const monterreyLat = 25.67;
const monterreyLng = -100.32;
const initialZoom = 10.5;

export default function MapScreen(props: MainMapProps) {
	const {className, 
		showFiscalia, 
		showCubrimientoDeSitio, 
		showRezagoSocial, 
		showSitiosDeApoyo} = props;

	const mapContainerRef = useRef<HTMLDivElement | null>(null);

	const [isLoaded, setIsLoaded] = useState(false);

	const mapRef = useRef<Map>();

	const xd = true

	useEffect(() => {

		if (!mapRef.current || !isLoaded) {
			return;
		}

		if (showFiscalia) {
			addFeminicidiosFiscaliaLayer(mapRef.current);
			return () => {
				if (mapRef.current) {
					removeFeminicidiosFiscaliaLayer(mapRef.current);
				}
			};
		}

		addFeminicidiosPeriodicosLayer(mapRef.current);

		return () => {
			if (mapRef.current) {
				removeFeminicidiosPeriodicosLayer(mapRef.current);
			}
		};
	}, [showFiscalia, isLoaded]);


	useEffect(() => {

		if (!mapRef.current || !isLoaded) {
			return;
		}

		if(showCubrimientoDeSitio) addAreaSinCubrimientoDeSitioLayer(mapRef.current);

		return () => {
			if (mapRef.current) {
				removeAreaSinCubrimientoDeSitioLayer(mapRef.current);
			}
		};

	}, [showCubrimientoDeSitio, isLoaded]);

	useEffect(() => {

		if (!mapRef.current || !isLoaded) {
			return;
		}

		if(showRezagoSocial) addResagoSocialLayer(mapRef.current);

		return () => {
			if (mapRef.current) {
				removeResagoSocialLayer(mapRef.current);
			}
		};

	}, [showRezagoSocial, isLoaded]);


	useEffect(() => {

		if (!mapRef.current || !isLoaded) {
			return;
		}

		if(showSitiosDeApoyo) addSitiosDeApoyoLayer(mapRef.current);

		return () => {
			if (mapRef.current) {
				removeSitiosDeApoyoLayer(mapRef.current);
			}
		};

	}, [showSitiosDeApoyo, isLoaded]);

	useEffect(() => {
		if (mapContainerRef.current) {
			mapRef.current = new Map({
				container: mapContainerRef.current,
				style: 'mapbox://styles/stock44/clwwmpmk7003501nm1y6eh0q4',
				center: [monterreyLng, monterreyLat],
				maxBounds: [
					[monterreyLng - 2, monterreyLat - 3],
					[monterreyLng + 2, monterreyLat + 3],
				],
				zoom: initialZoom,
			});

			const map = mapRef.current;
			

			map.on('load', () => {
				addResagoSocialSource(map);

				addAreaSinCubrimientoDeSitioSource(map);

				addFeminiciosFiscaliaSource(map);

				addFeminicidiosPeriodicosSource(map);

				addSitiosDeApoyoSource(map);

				setIsLoaded(true);
				
			});

			/*
			 Related documentation:
              https://docs.mapbox.com/style-spec/reference/layers/#minzoom
              https://docs.mapbox.com/data/tilesets/guides/
              https://docs.mapbox.com/mapbox-gl-js/api/sources/
              https://docs.mapbox.com/mapbox-gl-js/api/sources/
              https://docs.mapbox.com/mapbox-gl-js/example/vector-source/
              https://docs.mapbox.com/help/glossary/source-layer/
			 */
			return () => map.remove();
		}
	}, []);
	return <div ref={mapContainerRef} className={className} />;
}
