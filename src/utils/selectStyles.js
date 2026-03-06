// src/utils/selectStyles.js

export const getCustomSelectStyles = (theme) => {
    return {
        control: (provided, state) => ({
            ...provided,
            backgroundColor: theme.colors.inputBg,
            borderColor: state.isFocused ? theme.colors.primary : theme.colors.border,
            boxShadow: state.isFocused ? `0 0 0 3px ${theme.colors.primary}33` : 'none',
            '&:hover': {
                borderColor: theme.colors.primary
            }
        }),
        menu: (provided) => ({
            ...provided,
            backgroundColor: theme.colors.inputBg,
            zIndex: 9999
        }),
        option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isFocused ? `${theme.colors.primary}33` : 'transparent',
            color: theme.colors.text,
            cursor: 'pointer',
            '&:active': {
                backgroundColor: theme.colors.primary
            }
        }),
        multiValue: (provided) => ({
            ...provided,
            backgroundColor: theme.colors.primary,
            borderRadius: '4px'
        }),
        multiValueLabel: (provided) => ({
            ...provided,
            color: '#fff',
        }),
        multiValueRemove: (provided) => ({
            ...provided,
            color: '#fff',
            ':hover': {
                backgroundColor: 'rgba(0,0,0,0.2)',
                color: '#fff',
            },
        }),
    };
};