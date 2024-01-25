import useModal from 'hooks/useModal'
import { TitleBox, BoxLayout, ShortArrowIcon, Button } from 'commons'
import { ShipmentCard } from 'components'
import { observer } from 'mobx-react-lite'
import { useStore } from 'models/root.store'
import { PackageServices, UserServices } from 'services'
import { message } from 'antd'

interface ShipmentProps {
	variant?: 'pending' | 'history'
	shipmentTitle: string
}

export const ShipmentView = observer(function ({
	variant,
	shipmentTitle,
}: ShipmentProps) {
	const {
		users: {
			loggedUserPendingPackages,
			loggedUserDeliveredPackages,
			loggedUser,
			selectedCarrierDeliveredPackages,
			selectedCarrierPendingPackages,
			setUserLogged,
		},
	} = useStore()

	const isCarrier = loggedUser?.role === 'CARRIER'
	const isAdmin = loggedUser?.role === 'ADMIN'

	const packs = (() => {
		switch (true) {
			case isCarrier && variant === 'pending':
				return loggedUserPendingPackages
			case isCarrier && variant !== 'pending':
				return loggedUserDeliveredPackages
			case isAdmin && variant === 'pending':
				return selectedCarrierPendingPackages
			default:
				return selectedCarrierDeliveredPackages
		}
	})()

	const packsToShow = packs?.filter((pack) =>
		isCarrier ? pack.isShownToCarrier : pack.isShownToAdmin
	)

	const handleShowAllPackages = async () => {
		try {
			if (packs && loggedUser) {
				for (const pack of packs) {
					await PackageServices.udapatePackage(pack._id, {
						...pack,
						isShownToCarrier: true,
					})
				}
				message.success('Mostrando todos los paquetes')
				const updatedUser = await UserServices.getUserById(loggedUser._id)
				setUserLogged(updatedUser.data)
			}
		} catch (error) {
			console.error('Error al mostrar todos los paquetes: ', error)
			throw error
		}
	}

	const { isModalOpen, toggleModal } = useModal()

	return (
		<BoxLayout className="bg-white">
			<TitleBox
				className={`${isModalOpen && 'rounded-b-none'}`}
				subtitle={packs?.length ? '' : 'Sin repartos'}
				onClick={toggleModal}
				icon={
					<ShortArrowIcon
						className={`w-4 transition-all duration-150 ${
							isModalOpen ? 'rotate-[270deg]' : 'rotate-180'
						}`}
					/>
				}>
				{shipmentTitle}
			</TitleBox>

			{isModalOpen && packs?.length ? (
				<section className="p-2 overflow-scroll h-max-[20%]">
					{variant === 'history' ? (
						<div>
							<div className="font-roboto text-xs font-medium pb-2 flex items-center justify-between">
								{`Mostrando ${packsToShow?.length} de ${packs.length} paquetes entregados`}
								<Button variant="secondary" onClick={handleShowAllPackages}>
									Mostrar todos
								</Button>
							</div>
							<hr></hr>
						</div>
					) : null}
					{packsToShow?.map((pack) => <ShipmentCard pack={pack} key={pack._id} />)}
				</section>
			) : null}
		</BoxLayout>
	)
})
