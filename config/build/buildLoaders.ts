import MiniCssExtractPlugin from "mini-css-extract-plugin"
import webpack from "webpack"
import { BuildOptions } from "./types/config"
import path from "path"

export function buildLoaders({ isDev }: BuildOptions): webpack.RuleSetRule[] {
  const tsLoader = {
    test: /\.tsx?$/,
    use: 'ts-loader',
    exclude: /node_modules/,
  }

  const babelLoader = {
    test: /\.(js|jsx|ts|tsx)$/,
    exclude: /node_modules/,
    use: {
      loader: 'babel-loader',
      options: {
        configFile: path.resolve('config', 'babel', 'babel.config.json'),
        presets: [['@babel/preset-env', { targets: 'defaults' }]],
      },
    },
  };

  const cssLoader = {
    test: /\.s[ac]ss$/i,
    use: [
      isDev ? 'style-loader' : MiniCssExtractPlugin.loader,
      {
        loader: 'css-loader',
        options: {
          modules: {
            auto: (resPath: string) => Boolean(resPath.includes('.module')),
            localIdentName: isDev ? '[path][name]__[local]--[hash:base64:5]' : '[hash:base64:8]'
          }
        }
      },
      'sass-loader'
    ]
  }

  const fileLoader = {
    test: /\.(png|jpe?g|gif|svg|woff2|woff)$/i,
    type: 'asset/resource'
  }

  return [
    babelLoader, tsLoader, cssLoader, fileLoader
  ]
}