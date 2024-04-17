/* eslint-disable complexity */
import {
  forwardRef,
  useContext,
  useEffect,
  useImperativeHandle,
  useRef,
} from "react";

import type { Ref } from "react";
import { GoogleMapsContext, latLngEquals } from "@vis.gl/react-google-maps";

export type RectangleProps = google.maps.RectangleOptions;

export type RectangleRef = Ref<google.maps.Rectangle | null>;

function useRectangle(props: RectangleProps) {
  const { bounds, ...rectangleOptions } = props;
  const rectangle = useRef(new google.maps.Rectangle()).current;
  // update rectangleOptions (note the dependencies aren't properly checked
  // here, we just assume that setOptions is smart enough to not waste a
  // lot of time updating values that didn't change)
  rectangle.setOptions(rectangleOptions);
  rectangle.setBounds(bounds);



  const map = useContext(GoogleMapsContext)?.map;

  // create rectangle instance and add to the map once the map is available
  useEffect(() => {
    if (!map) {
      if (map === undefined)
        console.error("<Rectangle> has to be inside a Map component.");

      return;
    }

    rectangle.setMap(map);

    return () => {
      rectangle.setMap(null);
    };
  }, [map]);

  return rectangle;
}

/**
 * Component to render a Google Maps Rectangle on a map
 */
export const Rectangle = forwardRef((props: RectangleProps, ref: RectangleRef) => {
  const rectangle = useRectangle(props);

  useImperativeHandle(ref, () => rectangle);

  return null;
});
