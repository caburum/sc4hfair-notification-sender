export const autoGrowHeight = (node: any, height = 'auto') => {
	const textarea = node as HTMLTextAreaElement; // smui causes weird casting issues, this should only be on a textarea

	const resizer = textarea.closest<HTMLSpanElement>('.mdc-text-field__resizer');
	if (resizer) resizer.style.resize = 'none';

	const handleInput = () => {
		textarea.style.height = height;
		textarea.style.height = `${textarea.scrollHeight}px`;
	};

	textarea.addEventListener('input', handleInput);
	return {
		destroy() {
			textarea.removeEventListener('input', handleInput);
		}
	};
};
