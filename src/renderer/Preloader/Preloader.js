import React, { Component } from "react";
import { connect } from "react-redux";

import * as THREE from "three";
import { updateMainGameObject } from "../../stores/scene/actions";
import { AudioLoader, BufferGeometryLoader, ObjectLoader } from "three";
import { OBJLoader } from "three/examples/jsm/loaders/OBJLoader";
import { MMDLoader } from "three/examples/jsm/loaders/MMDLoader";
import { FileLoader } from "three";

import "./Preloader.css";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader";

class Preloader extends Component {
  manager = new THREE.LoadingManager();

  state = {
    loading: [],
    loaded: {}
  };

  getAssetById = assetId => {
    return this.state.loaded[assetId];
  };

  load = () => {
    const { preloadWaitToStart, markAssetsAsLoaded } = this.props;

    this.manager.onStart = (url, itemsLoaded, itemsTotal) => {
      console.log(
        "[LoaderManager] Started pre loading on file: " +
          url +
          ".\nLoaded " +
          itemsLoaded +
          " of " +
          itemsTotal +
          " files."
      );
    };

    this.manager.onProgress = (item, loaded, total) => {
      // this gets called after an object has been loaded
      this.setState({ loading: [...this.state.loading, item] });
      // console.log("[LoaderManager] loaded item:", item, loaded, total);
    };

    this.manager.onLoad = () => {
      // everything is loaded
      // call your other function
      //
      this.setState({ ready: true });
      console.log("[LoaderManager] Preload complete", this);
      if (!preloadWaitToStart) {
        markAssetsAsLoaded();
      }
    };

    this.manager.onError = url => {
      alert("[LoaderManager] There was an error loading " + url);
    };
    this.initHandlers();
    if (!Object.keys(this.props.assets).length) {
      this.manager.onLoad();
      return;
    }
    Object.keys(this.props.assets).forEach(assetTag => {
      const assetFileURL = this.props.assets[assetTag];
      const currentLoader = this.manager.getHandler(
        this.props.assets[assetTag]
      );
      currentLoader.load(assetFileURL, loadedAsset => {
        let asset = loadedAsset;
        if (asset.isMesh) {
          // console.log("mesh",loadedAsset,asset);
        }
        if (asset.isGroup) {
          asset = loadedAsset.children[0];
          // console.log("group",loadedAsset,asset);
        }
        if (asset.scene) {
          asset = loadedAsset.scene;
          // console.log("group",loadedAsset,asset);
        }

        this.setState({
          loaded: {
            ...this.state.loaded,
            [assetTag]: asset
          }
        });
      });
    });
  };

  initHandlers() {
    this.manager.addHandler(/\.pmx$/i, new MMDLoader(this.manager));
    this.manager.addHandler(/\.mp3$/i, new AudioLoader(this.manager));
    this.manager.addHandler(/\.glsl$/i, new FileLoader(this.manager));
    this.manager.addHandler(/\.glb$/i, new GLTFLoader(this.manager));
    this.manager.addHandler(/\.gltf/i, new GLTFLoader(this.manager));
    this.manager.addHandler(/\.mesh.json$/i, new ObjectLoader(this.manager));
    this.manager.addHandler(/\.json$/i, new BufferGeometryLoader(this.manager));
    this.manager.addHandler(/\.obj$/i, new OBJLoader(this.manager));
    this.manager.addHandler(/\.wav$/i, new AudioLoader(this.manager));
  }

  componentDidMount() {
    this.load();
  }

  render() {
    const { assetsLoadState, assets } = this.props;
    const { ready } = this.state;
    if (!assetsLoadState) {
      return (
        <div className={"preloader"}>
          Loading...
          {Object.keys(this.state.loaded).map((item, index) => {
            return (
              <div key={`preloader_${index}`}>
                {`${item}:`} <br /> {`${assets[item].toUpperCase()}`}
              </div>
            );
          })}
          {}
          {ready ? (
            <div key={"preloader_ready"}>
              {" "}
              READY! <br />
              <button className="full" onClick={this.props.markAssetsAsLoaded}>
                Start
              </button>
            </div>
          ) : null}
        </div>
      );
    } else {
      return this.props.children;
    }
  }
}

const getAssetLoadState = state => {
  return state.mainReducer.game.assetsLoadState;
};

const mapStateToProps = (state, ownProps) => {
  return {
    assetsLoadState: getAssetLoadState(state),
    assets: state.mainReducer.game.assets,
    preloadWaitToStart: state.mainReducer.game.preloadWaitToStart
  };
};

const mapDispatchToProps = dispatch => ({
  markAssetsAsLoaded: () => {
    dispatch(updateMainGameObject({ assetsLoadState: true }));
  }
});

export default connect(mapStateToProps, mapDispatchToProps, null, {
  forwardRef: true
})(Preloader);
