import { Button, Grid, makeStyles, MenuItem, Select } from "@material-ui/core";
import { useState, useEffect, useCallback, FormEvent, useRef, FunctionComponent } from "react";
import { Loader } from "google-maps";
import { Route } from "../util/models";
import { getCurrentPosition } from "../util/geolocation";
import { Map, makeCarIcon, makeMarkerIcon } from '../util/map';
import { sample, shuffle } from 'lodash'
import { RouteExistsError } from '../errors/route-exists.error';
import { useSnackbar } from "notistack";
import { Navbar } from "./Navbar";

const API_URL = import.meta.env.VITE_API_URL;

const googleMapsLoader = new Loader(import.meta.env.VITE_GOOGLE_API_KEY);

const colors = [
  "#b71c1c",
  "#4a148c",
  "#2e7d32",
  "#e65100",
  "#2962ff",
  "#c2185b",
  "#FFCD00",
  "#3e2723",
  "#03a9f4",
  "#827717",
]

const useStyles = makeStyles({
  root: {
    width: '100%',
    height: '100%',
  },
  form: {
    margin: '16px',
  },
  btnSubmitWrapper: {
    textAlign: 'center',
    marginTop: '8px',
  },
  map: {
    width: '100%',
    height: '100%',
  },
})

export const Mapping: FunctionComponent = () => {
  const classes = useStyles();
  const [routes, setRoutes] = useState<Route[]>([]);
  const [routeIdSelected, setRouteIdSelected] = useState<string>("");
  const mapRef = useRef<Map>();
  const { enqueueSnackbar } = useSnackbar();

  useEffect(() => {
    fetch(`${API_URL}/routes`)
      .then((data) => data.json())
      .then((data) => setRoutes(data));
  }, []);

  useEffect(() => {
    (async () => {
      const [, position] = await Promise.all([
        googleMapsLoader.load(),
        getCurrentPosition({ enableHighAccuracy: true }),
      ]);
      const divMap = document.getElementById("map") as HTMLElement;
      mapRef.current = new Map(divMap, {
        zoom: 15,
        center: position,
      });
    })();
  }, []);

  const startRoute = useCallback(
    (event: FormEvent) => {
      event.preventDefault();
      const route = routes.find((route) => route._id === routeIdSelected);
      const color = sample(shuffle(colors)) as string;
      
      try {
        mapRef.current?.addRoute(routeIdSelected, {
          currentMarkerOptions: {
            position: route?.startPosition,
            icon: makeCarIcon(color)
          },
          endMarkerOptions: {
            position: route?.endPosition,
            icon: makeMarkerIcon(color)
          },
        });
      } catch(error) {
        if (error instanceof RouteExistsError) {
          enqueueSnackbar(`${route?.title} já selecionado, espere finalizar.`, {
            variant: "error"
          })
          return;
        }
        throw error;
      }
    },
    [routeIdSelected, routes, enqueueSnackbar]
  );

  return (
    <Grid className={classes.root} container>
      <Grid item xs={12} sm={3}>
        <Navbar />
        <form onSubmit={startRoute} className={classes.form}>
          <Select
            fullWidth
            displayEmpty
            value={routeIdSelected}
            onChange={(event) => setRouteIdSelected(event.target.value + "")}
          >
            <MenuItem value="">Select a route</MenuItem>

            {routes.map((route, key) => (
              <MenuItem key={key} value={route._id}>
                <em>{route.title}</em>
              </MenuItem>
            ))}
          </Select>

          <div className={classes.btnSubmitWrapper}>
          <Button type="submit" color="primary" variant="contained">
            Start a delivery
          </Button>

          </div>

        </form>
      </Grid>
      <Grid item xs={12} sm={9}>
        <div id="map" className={classes.map} />
      </Grid>
    </Grid>
  );
};
