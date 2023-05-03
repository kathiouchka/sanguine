const SHARED_OPACITY_OVERRIDE = `
  dark:hover:bg-opacity-20
  dark:focus:bg-opacity-20
  dark:active:bg-opacity-20
  `

export const getButtonStyleForCoin = (tokenColor: string): string =>
  `shadow-${tokenColor}-xl border-${tokenColor}-100 dark:border-opacity-50 dark:border-${tokenColor}-700`

export const getMenuItemStyleForCoin = (tokenColor: string): string =>
  `hover:bg-${tokenColor}-50 focus:bg-${tokenColor}-50 active:bg-${tokenColor}-50`

export const getMenuItemStyleForCoinDark = (tokenColor: string): string =>
  `${SHARED_OPACITY_OVERRIDE} dark:hover:bg-${tokenColor}-500 dark:focus:bg-${tokenColor}-500 dark:active:bg-${tokenColor}-500`

export const getMenuItemStyleForCoinCombined = (tokenColor: string): string => {
  return `${getMenuItemStyleForCoin(tokenColor)}
  ${getMenuItemStyleForCoinDark(tokenColor)}`
}

export const getSwapHoverStyleForCoin = (tokenColor: string): string =>
  `hover:shadow-${tokenColor}-xl border-${tokenColor}-100`

export const getMenuItemBgForCoin = (tokenColor: string): string =>
  `bg-${tokenColor}-50 dark:bg-opacity-20 dark:bg-${tokenColor}-700`

export const getMenuItemHoverBgForCoin = (tokenColor: string): string =>
  ` hover:bg-${tokenColor}-100 dark:hover:bg-opacity-20 dark:hover:bg-${tokenColor}-700`

export const getCoinTextColor = (tokenColor: string): string =>
  `text-${tokenColor}-500 group-hover:text-${tokenColor}-400`

export const getCoinTextColorDark = (tokenColor: string): string =>
  `dark:text-${tokenColor}-500 dark:group-hover:text-${tokenColor}-400`

export const getCoinTextColorAlt = (tokenColor: string): string =>
  `dark:text-${tokenColor}-500 dark:group-hover:text-${tokenColor}-400`

export const getCoinTextColorCombined = (tokenColor: string): string => {
  return `${getCoinTextColor(tokenColor)} ${getCoinTextColorDark(tokenColor)}`
}

export const getCardStyleByPool = (tokenColor: string): string =>
  `shadow-${tokenColor}-lg hover:shadow-${tokenColor}-2xl`

export const getInputBorderFocusStyleForCoin = (tokenColor: string): string =>
  `focus-within:border-${tokenColor}-200 dark:focus-within:border-${tokenColor}-500`

export const getSwapBorderStyleForCoin = (tokenColor: string): string =>
  `border-${tokenColor}-50 dark:border-opacity-20 dark:border-${tokenColor}-700`

export const getSwapBorderHoverStyleForCoin = (tokenColor: string): string =>
  `hover:border-${tokenColor}-100 dark:hover:border-opacity-50 dark:hover:!border-${tokenColor}-700`

/**
 * @param {Token} coin
 */
export const getBorderStyleForCoin = (tokenColor: string): string =>
  `border-${tokenColor}-300`

export const getFromStyleForCoin = (tokenColor: string): string =>
  `from-${tokenColor}-300`

export const getToStyleForCoin = (tokenColor: string): string =>
  `to-${tokenColor}-300`

export const getSwapCardShadowStyleForCoin = (tokenColor: string): string =>
  `shadow-${tokenColor}-xl hover:shadow-${tokenColor}-2xl`

export const getBorderStyleForCoinHover = (tokenColor: string): string =>
  `hover:border-${tokenColor}-300`